import { ApiResponse, AreaCodeItem, TourDetail, TourImage, TourIntro, TourItem, PetTourItem } from "@/lib/types/tour";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";
const API_KEY = process.env.TOUR_API_KEY || process.env.NEXT_PUBLIC_TOUR_API_KEY || "";

// Common parameters for all API calls
const COMMON_PARAMS = {
    MobileOS: "ETC",
    MobileApp: "MyTrip",
    _type: "json",
};

/**
 * Helper function to fetch data from the Korea Tourism Organization API
 */
async function fetchTourApi<T>(endpoint: string, params: Record<string, string | number>): Promise<T[]> {
    if (!API_KEY) {
        console.warn("Tour API Key is missing!");
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

    // Add Service Key (Append manually to avoid double encoding issues if the key is already encoded)
    // Note: URLSearchParams encodes values. If API_KEY is already encoded (contains %), 
    // using searchParams.append will double encode it (e.g. % -> %25).
    // However, the standard way is to use the DECODED key with searchParams.
    // If the user provided the ENCODED key in env, we should probably decode it first or append manually.
    // For safety, we'll append it manually to the search string.

    // Construct the final URL string
    let finalUrl = url.toString();
    // Check if API_KEY is already encoded (simple check)
    const isEncoded = API_KEY.includes("%");

    // If we use searchParams.append('serviceKey', API_KEY), it will encode it.
    // If the key is already encoded, we want to append it as is.
    // But we can't easily mix searchParams and manual appending cleanly without string manipulation.

    // Let's try to append it to the search params using the decoded version if possible.
    // But we don't know if the user put the encoded or decoded key.
    // A robust way for data.go.kr is to append `&serviceKey=KEY` at the end of the string.

    finalUrl += `&serviceKey=${API_KEY}`;

    try {
        const response = await fetch(finalUrl, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse<T> = await response.json();

        if (data.response.header.resultCode !== "0000") {
            console.error(`API Error: ${data.response.header.resultMsg}`);
            return [];
        }

        const items = data.response.body.items;
        if (items === "") {
            return [];
        }

        return items.item;
    } catch (error) {
        console.error("Failed to fetch tour API:", error);
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
