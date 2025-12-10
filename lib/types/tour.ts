/**
 * @file tour.ts
 * @description 한국관광공사 API 관련 타입 정의
 *
 * 이 파일은 한국관광공사 공공 API를 사용하기 위한 TypeScript 타입 정의를 포함합니다.
 * - API 응답 구조
 * - 관광지 데이터 타입
 * - 에러 처리 타입
 * - 관광 타입 ID enum
 */

/**
 * 관광 콘텐츠 타입 ID
 * PRD 4.4에 명시된 관광 타입 분류
 */
export enum ContentTypeId {
    /** 관광지 */
    TOURIST_SPOT = "12",
    /** 문화시설 */
    CULTURAL_FACILITY = "14",
    /** 축제/행사 */
    FESTIVAL_EVENT = "15",
    /** 여행코스 */
    TRAVEL_COURSE = "25",
    /** 레포츠 */
    LEISURE_SPORTS = "28",
    /** 숙박 */
    ACCOMMODATION = "32",
    /** 쇼핑 */
    SHOPPING = "38",
    /** 음식점 */
    RESTAURANT = "39",
}

/**
 * 한국관광공사 API 응답 구조
 * @template T - 응답 데이터 타입
 */
export interface ApiResponse<T> {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            items: {
                item: T[];
            } | ""; // items can be empty string if no results
            numOfRows: number;
            pageNo: number;
            totalCount: number;
        };
    };
}

/**
 * 에러 타입 구분
 */
export enum TourApiErrorType {
    NETWORK_ERROR = "NETWORK_ERROR",
    API_ERROR = "API_ERROR",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    PARAMETER_ERROR = "PARAMETER_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Tour API 에러 클래스
 * 한국관광공사 API 호출 시 발생하는 에러를 처리하기 위한 커스텀 에러 클래스
 */
export class TourApiError extends Error {
    public readonly type: TourApiErrorType;
    public readonly retryable: boolean;
    public readonly originalError?: Error;
    public readonly url?: string;
    public readonly statusCode?: number;
    public readonly resultCode?: string;
    public readonly resultMsg?: string;

    constructor(
        message: string,
        type: TourApiErrorType,
        options?: {
            retryable?: boolean;
            originalError?: Error;
            url?: string;
            statusCode?: number;
            resultCode?: string;
            resultMsg?: string;
        }
    ) {
        super(message);
        this.name = "TourApiError";
        this.type = type;
        this.retryable = options?.retryable ?? false;
        this.originalError = options?.originalError;
        this.url = options?.url;
        this.statusCode = options?.statusCode;
        this.resultCode = options?.resultCode;
        this.resultMsg = options?.resultMsg;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TourApiError);
        }
    }
}

/**
 * 지역 코드 정보
 * areaCode2 API 응답 데이터
 */
export interface AreaCodeItem {
    /** 지역 코드 */
    code: string;
    /** 지역명 */
    name: string;
    /** 순번 */
    rnum: number;
}

/**
 * 관광지 목록 항목
 * areaBasedList2, searchKeyword2 API 응답 데이터
 * PRD 5.1 참고
 */
export interface TourItem {
    /** 주소 */
    addr1: string;
    /** 상세주소 */
    addr2?: string;
    /** 지역코드 */
    areacode: string;
    /** 예약 가능 여부 */
    booktour?: string;
    /** 대분류 */
    cat1?: string;
    /** 중분류 */
    cat2?: string;
    /** 소분류 */
    cat3?: string;
    /** 콘텐츠ID */
    contentid: string;
    /** 콘텐츠타입ID (ContentTypeId enum 참고) */
    contenttypeid: string;
    /** 생성일시 */
    createdtime: string;
    /** 대표이미지1 */
    firstimage?: string;
    /** 대표이미지2 */
    firstimage2?: string;
    /** 저작권 구분 코드 */
    cpyrhtDivCd?: string;
    /** 경도 (KATEC 좌표계, 정수형) */
    mapx: string;
    /** 위도 (KATEC 좌표계, 정수형) */
    mapy: string;
    /** 지도 레벨 */
    mlevel?: string;
    /** 수정일시 */
    modifiedtime: string;
    /** 시군구 코드 */
    sigungucode?: string;
    /** 전화번호 */
    tel?: string;
    /** 관광지명 (제목) */
    title: string;
    /** 우편번호 */
    zipcode?: string;
}

/**
 * 관광지 상세 정보
 * detailCommon2 API 응답 데이터
 * PRD 5.2 참고
 */
export interface TourDetail {
    /** 콘텐츠ID */
    contentid: string;
    /** 콘텐츠타입ID (ContentTypeId enum 참고) */
    contenttypeid: string;
    /** 관광지명 (제목) */
    title: string;
    /** 생성일시 */
    createdtime: string;
    /** 수정일시 */
    modifiedtime: string;
    /** 전화번호 */
    tel?: string;
    /** 전화번호명 */
    telname?: string;
    /** 홈페이지 URL */
    homepage?: string;
    /** 예약 가능 여부 */
    booktour?: string;
    /** 대표이미지1 */
    firstimage?: string;
    /** 대표이미지2 */
    firstimage2?: string;
    /** 저작권 구분 코드 */
    cpyrhtDivCd?: string;
    /** 지역코드 */
    areacode?: string;
    /** 시군구 코드 */
    sigungucode?: string;
    /** 대분류 */
    cat1?: string;
    /** 중분류 */
    cat2?: string;
    /** 소분류 */
    cat3?: string;
    /** 주소 */
    addr1?: string;
    /** 상세주소 */
    addr2?: string;
    /** 우편번호 */
    zipcode?: string;
    /** 경도 (KATEC 좌표계, 정수형) */
    mapx?: string;
    /** 위도 (KATEC 좌표계, 정수형) */
    mapy?: string;
    /** 지도 레벨 */
    mlevel?: string;
    /** 개요 (긴 설명문) */
    overview?: string;
}

/**
 * 관광지 운영 정보
 * detailIntro2 API 응답 데이터
 * 타입별로 필드가 다를 수 있으므로 index signature 사용
 * PRD 5.3 참고
 */
export interface TourIntro {
    /** 콘텐츠ID */
    contentid: string;
    /** 콘텐츠타입ID (ContentTypeId enum 참고) */
    contenttypeid: string;
    /** 문화재 분류1 */
    heritage1?: string;
    /** 문화재 분류2 */
    heritage2?: string;
    /** 문화재 분류3 */
    heritage3?: string;
    /** 문의처 */
    infocenter?: string;
    /** 개장일 */
    opendate?: string;
    /** 휴무일 */
    restdate?: string;
    /** 체험 안내 */
    expguide?: string;
    /** 체험 가능 연령 */
    expagerange?: string;
    /** 수용인원 */
    accomcount?: string;
    /** 이용시기 */
    useseason?: string;
    /** 이용시간 */
    usetime?: string;
    /** 주차 가능 여부 */
    parking?: string;
    /** 유모차 대여 가능 여부 */
    chkbabycarriage?: string;
    /** 반려동물 동반 가능 여부 */
    chkpet?: string;
    /** 신용카드 가능 여부 */
    chkcreditcard?: string;
    /** 타입별 추가 필드 (index signature) */
    [key: string]: string | undefined;
}

/**
 * 관광지 이미지 정보
 * detailImage2 API 응답 데이터
 */
export interface TourImage {
    /** 콘텐츠ID */
    contentid: string;
    /** 원본 이미지 URL */
    originimgurl: string;
    /** 이미지명 */
    imgname: string;
    /** 썸네일 이미지 URL */
    smallimageurl: string;
    /** 저작권 구분 코드 */
    cpyrhtDivCd?: string;
    /** 일련번호 */
    serialnum: string;
}

/**
 * 반려동물 동반 여행 정보
 * detailPetTour2 API 응답 데이터
 * PRD 2.5 참고
 */
export interface PetTourInfo {
    /** 콘텐츠ID */
    contentid: string;
    /** 콘텐츠타입ID */
    contenttypeid?: string;
    /** 애완동물 동반 여부 */
    chkpetleash?: string;
    /** 애완동물 크기 */
    chkpetsize?: string;
    /** 입장 가능 장소 (실내/실외) */
    chkpetplace?: string;
    /** 추가 요금 */
    chkpetfee?: string;
    /** 기타 반려동물 정보 */
    petinfo?: string;
    /** 주차장 정보 */
    parking?: string;
}

// Note: PetTourInfo structure might need adjustment based on actual API response
// The API documentation says it returns items similar to others.
// Let's assume it returns a list of pet info items or a single item with fields.
// Based on common knowledge of this API, detailPetTour2 returns items with specific fields.
/**
 * 반려동물 동반 여행 정보 (API 응답용)
 * detailPetTour2 API의 실제 응답 구조
 * PetTourInfo와 유사하지만 API 응답 필드명에 맞춤
 */
export interface PetTourItem {
    /** 콘텐츠ID */
    contentid: string;
    /** 콘텐츠타입ID */
    contenttypeid?: string;
    /** 반려동물 정보 (전체 텍스트) */
    petTourInfo?: string;
    /** 동반 타입 코드 */
    accompanyTypeCd?: string;
    /** 동반 타입명 */
    accompanyTypeName?: string;
    /** 기타 정보 */
    etcInfo?: string;
    /** 추가 필드 */
    [key: string]: string | undefined;
}
