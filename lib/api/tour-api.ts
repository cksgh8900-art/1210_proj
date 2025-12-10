/**
 * @file tour-api.ts
 * @description 한국관광공사 API 클라이언트
 *
 * 이 파일은 한국관광공사 공공 API를 호출하기 위한 클라이언트 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 지역코드 조회 (getAreaCode)
 * 2. 지역 기반 관광지 목록 조회 (getAreaBasedList)
 * 3. 키워드 검색 (searchKeyword)
 * 4. 공통 정보 조회 (getDetailCommon)
 * 5. 소개 정보 조회 (getDetailIntro)
 * 6. 이미지 정보 조회 (getDetailImage)
 * 7. 반려동물 동반 정보 조회 (getDetailPetTour)
 *
 * 핵심 구현 로직:
 * - 재시도 로직 (exponential backoff)
 * - 타임아웃 처리 (10초)
 * - 향상된 에러 처리 및 로깅
 * - API 키 인코딩 안전 처리
 *
 * @dependencies
 * - @/lib/types/tour: TourApiError, ApiResponse 및 데이터 타입
 */

import {
    ApiResponse,
    AreaCodeItem,
    TourDetail,
    TourImage,
    TourIntro,
    TourItem,
    PetTourItem,
    TourApiError,
    TourApiErrorType,
} from "@/lib/types/tour";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";
const API_KEY = process.env.TOUR_API_KEY || process.env.NEXT_PUBLIC_TOUR_API_KEY || "";

// Common parameters for all API calls
const COMMON_PARAMS = {
    MobileOS: "ETC",
    MobileApp: "MyTrip",
    _type: "json",
};

// Configuration constants
const MAX_RETRIES = 3;
const TIMEOUT_MS = 10000; // 10 seconds
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff delays in ms

/**
 * Check if we're in development environment
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely encode API key for URL
 * Handles both encoded and unencoded keys
 */
function encodeApiKey(key: string): string {
    // If key already contains encoded characters, assume it's already encoded
    if (key.includes("%")) {
        return key;
    }
    // Otherwise, encode it
    return encodeURIComponent(key);
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: TourApiError): boolean {
    if (!error.retryable) {
        return false;
    }

    // Network errors are retryable
    if (error.type === TourApiErrorType.NETWORK_ERROR) {
        return true;
    }

    // Timeout errors are retryable
    if (error.type === TourApiErrorType.TIMEOUT_ERROR) {
        return true;
    }

    // 5xx server errors are retryable
    if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
        return true;
    }

    // API errors with specific retryable result codes
    if (error.type === TourApiErrorType.API_ERROR) {
        // ERROR-500: 서버 오류 (재시도 가능)
        if (error.resultCode?.includes("ERROR-500")) {
            return true;
        }
    }

    return false;
}

/**
 * Fetch with retry logic and timeout
 */
async function fetchWithRetry(
    url: string,
    retryCount: number = 0
): Promise<Response> {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
        abortController.abort();
    }, TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            signal: abortController.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Handle AbortError (timeout)
        if (error instanceof Error && error.name === "AbortError") {
            throw new TourApiError(
                `Request timeout after ${TIMEOUT_MS}ms`,
                TourApiErrorType.TIMEOUT_ERROR,
                {
                    retryable: true,
                    originalError: error,
                    url,
                }
            );
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new TourApiError(
                `Network error: ${error.message}`,
                TourApiErrorType.NETWORK_ERROR,
                {
                    retryable: true,
                    originalError: error,
                    url,
                }
            );
        }

        // Re-throw TourApiError as-is
        if (error instanceof TourApiError) {
            throw error;
        }

        // Unknown error
        throw new TourApiError(
            `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
            TourApiErrorType.UNKNOWN_ERROR,
            {
                retryable: false,
                originalError: error instanceof Error ? error : new Error(String(error)),
                url,
            }
        );
    }
}

/**
 * Fetch with automatic retry on retryable errors
 */
async function fetchWithAutomaticRetry(url: string): Promise<Response> {
    let lastError: TourApiError | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (isDevelopment && attempt > 0) {
                console.group(`🔄 Retry attempt ${attempt}/${MAX_RETRIES}`);
                console.log(`URL: ${url}`);
                console.log(`Previous error: ${lastError?.message}`);
                console.groupEnd();
            }

            const response = await fetchWithRetry(url, attempt);

            // Check HTTP status
            if (!response.ok) {
                const statusCode = response.status;
                const isRetryable = statusCode >= 500 && statusCode < 600;

                throw new TourApiError(
                    `HTTP ${statusCode}: ${response.statusText}`,
                    TourApiErrorType.API_ERROR,
                    {
                        retryable: isRetryable,
                        url,
                        statusCode,
                    }
                );
            }

            // Success
            if (isDevelopment && attempt > 0) {
                console.log(`✅ Request succeeded after ${attempt} retries`);
            }

            return response;
        } catch (error) {
            const apiError =
                error instanceof TourApiError
                    ? error
                    : new TourApiError(
                          `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
                          TourApiErrorType.UNKNOWN_ERROR,
                          {
                              retryable: false,
                              originalError: error instanceof Error ? error : new Error(String(error)),
                              url,
                          }
                      );

            lastError = apiError;

            // Don't retry if:
            // 1. Not retryable
            // 2. Max retries reached
            // 3. Not a retryable error type
            if (!isRetryableError(apiError) || attempt >= MAX_RETRIES) {
                throw apiError;
            }

            // Wait before retrying (exponential backoff)
            const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
            await sleep(delay);
        }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError || new TourApiError("Failed after all retries", TourApiErrorType.UNKNOWN_ERROR);
}

/**
 * Helper function to fetch data from the Korea Tourism Organization API
 * Includes retry logic, timeout handling, and enhanced error handling
 */
async function fetchTourApi<T>(endpoint: string, params: Record<string, string | number>): Promise<T[]> {
    if (!API_KEY) {
        if (isDevelopment) {
            console.group("⚠️ Tour API Key Missing");
            console.warn("TOUR_API_KEY or NEXT_PUBLIC_TOUR_API_KEY environment variable is not set");
            console.groupEnd();
        }
        return [];
    }

    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add common params
    Object.entries(COMMON_PARAMS).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    // Add specific params
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });

    // Safely encode and append API key
    const encodedApiKey = encodeApiKey(API_KEY);
    const finalUrl = `${url.toString()}&serviceKey=${encodedApiKey}`;

    if (isDevelopment) {
        console.group(`📡 Tour API Request: ${endpoint}`);
        console.log(`URL: ${finalUrl.replace(encodedApiKey, "***")}`); // Hide API key in logs
        console.log(`Params:`, params);
    }

    try {
        const response = await fetchWithAutomaticRetry(finalUrl);
        const data: ApiResponse<T> = await response.json();

        // Check API response result code
        const resultCode = data.response.header.resultCode;
        const resultMsg = data.response.header.resultMsg;

        if (resultCode !== "0000") {
            // Determine error type and retryability
            let errorType = TourApiErrorType.API_ERROR;
            let retryable = false;

            if (resultCode.includes("ERROR-300")) {
                errorType = TourApiErrorType.PARAMETER_ERROR;
                retryable = false;
            } else if (resultCode.includes("ERROR-500")) {
                errorType = TourApiErrorType.API_ERROR;
                retryable = true;
            }

            const apiError = new TourApiError(
                `API Error: ${resultMsg} (Code: ${resultCode})`,
                errorType,
                {
                    retryable,
                    url: finalUrl,
                    resultCode,
                    resultMsg,
                }
            );

            if (isDevelopment) {
                console.group("❌ API Error");
                console.error(`Result Code: ${resultCode}`);
                console.error(`Result Message: ${resultMsg}`);
                console.error(`Error Type: ${errorType}`);
                console.error(`Retryable: ${retryable}`);
                console.groupEnd();
            }

            // If retryable, throw to trigger retry logic
            if (retryable) {
                throw apiError;
            }

            // Non-retryable errors: return empty array
            return [];
        }

        // Success - extract items
        const items = data.response.body.items;
        if (items === "") {
            if (isDevelopment) {
                console.log("✅ API call successful, but no items returned");
                console.groupEnd();
            }
            return [];
        }

        if (isDevelopment) {
            console.log(`✅ API call successful, returned ${items.item.length} items`);
            console.groupEnd();
        }

        return items.item;
    } catch (error) {
        // Handle TourApiError
        if (error instanceof TourApiError) {
            if (isDevelopment) {
                console.group("❌ Tour API Error");
                console.error(`Type: ${error.type}`);
                console.error(`Message: ${error.message}`);
                console.error(`Retryable: ${error.retryable}`);
                console.error(`URL: ${error.url?.replace(encodedApiKey, "***")}`);
                if (error.statusCode) {
                    console.error(`Status Code: ${error.statusCode}`);
                }
                if (error.resultCode) {
                    console.error(`Result Code: ${error.resultCode}`);
                }
                if (error.originalError) {
                    console.error(`Original Error:`, error.originalError);
                }
                console.groupEnd();
            }

            // If error is retryable and we haven't exhausted retries, it should have been retried
            // If we're here, all retries failed or error is not retryable
            return [];
        }

        // Handle unexpected errors
        if (isDevelopment) {
            console.group("❌ Unexpected Error");
            console.error("Failed to fetch tour API:", error);
            console.error(`URL: ${finalUrl.replace(encodedApiKey, "***")}`);
            console.groupEnd();
        }

        return [];
    }
}

/**
 * 지역 코드 조회
 */
export async function getAreaCode(areaCode?: string): Promise<AreaCodeItem[]> {
    const params: Record<string, string | number> = {
        numOfRows: 100,
    };
    if (areaCode) {
        params.areaCode = areaCode;
    }
    return fetchTourApi<AreaCodeItem>("/areaCode2", params);
}

/**
 * 지역 기반 관광지 목록 조회
 */
export async function getAreaBasedList(
    areaCode: string,
    contentTypeId?: string,
    pageNo: number = 1,
    numOfRows: number = 10,
    sigunguCode?: string,
    cat1?: string,
    cat2?: string,
    cat3?: string
): Promise<TourItem[]> {
    const params: Record<string, string | number> = {
        listYN: "Y",
        arrange: "C",
        numOfRows,
        pageNo,
    };

    if (areaCode && areaCode !== "all") params.areaCode = areaCode;
    if (sigunguCode) params.sigunguCode = sigunguCode;
    if (contentTypeId && contentTypeId !== "all") params.contentTypeId = contentTypeId;
    if (cat1) params.cat1 = cat1;
    if (cat2) params.cat2 = cat2;
    if (cat3) params.cat3 = cat3;

    return fetchTourApi<TourItem>("/areaBasedList2", params);
}

/**
 * 키워드 검색
 */
export async function searchKeyword(
    keyword: string,
    pageNo: number = 1,
    numOfRows: number = 10,
    areaCode?: string,
    contentTypeId?: string
): Promise<TourItem[]> {
    const params: Record<string, string | number> = {
        listYN: "Y",
        arrange: "C",
        numOfRows,
        pageNo,
        keyword,
    };

    if (areaCode) params.areaCode = areaCode;
    if (contentTypeId) params.contentTypeId = contentTypeId;

    return fetchTourApi<TourItem>("/searchKeyword2", params);
}

/**
 * 공통 정보 조회 (상세페이지 기본)
 */
export async function getDetailCommon(contentId: string): Promise<TourDetail | null> {
    const params = {
        contentId,
        defaultYN: "Y",
        firstImageYN: "Y",
        areacodeYN: "Y",
        catcodeYN: "Y",
        addrinfoYN: "Y",
        mapinfoYN: "Y",
        overviewYN: "Y",
    };

    const items = await fetchTourApi<TourDetail>("/detailCommon2", params);
    return items.length > 0 ? items[0] : null;
}

/**
 * 소개 정보 조회 (운영 정보)
 */
export async function getDetailIntro(contentId: string, contentTypeId: string): Promise<TourIntro | null> {
    const params = {
        contentId,
        contentTypeId,
    };

    const items = await fetchTourApi<TourIntro>("/detailIntro2", params);
    return items.length > 0 ? items[0] : null;
}

/**
 * 이미지 정보 조회
 */
export async function getDetailImage(contentId: string): Promise<TourImage[]> {
    const params = {
        contentId,
        imageYN: "Y",
        subImageYN: "Y",
    };

    return fetchTourApi<TourImage>("/detailImage2", params);
}

/**
 * 반려동물 동반 정보 조회
 */
export async function getDetailPetTour(contentId: string): Promise<PetTourItem | null> {
    const params = {
        contentId,
    };

    // Note: The return type might need adjustment based on real API response
    const items = await fetchTourApi<PetTourItem>("/detailPetTour2", params);
    return items.length > 0 ? items[0] : null;
}
