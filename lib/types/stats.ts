/**
 * @file stats.ts
 * @description 통계 대시보드 관련 타입 정의
 *
 * 이 파일은 통계 대시보드 페이지에서 사용하는 타입 정의를 포함합니다.
 * - 지역별 관광지 통계
 * - 타입별 관광지 통계
 * - 통계 요약 정보
 * - 차트 데이터 포인트
 *
 * PRD 2.6 참고
 */

/**
 * 지역별 관광지 통계
 * PRD 2.6.1 참고
 */
export interface RegionStats {
    /** 지역 코드 */
    areaCode: string;
    /** 지역명 */
    areaName: string;
    /** 관광지 개수 */
    count: number;
}

/**
 * 타입별 관광지 통계
 * PRD 2.6.2 참고
 */
export interface TypeStats {
    /** 콘텐츠 타입 ID (ContentTypeId enum 참고) */
    contentTypeId: string;
    /** 타입명 */
    typeName: string;
    /** 관광지 개수 */
    count: number;
    /** 비율 (백분율) */
    percentage: number;
}

/**
 * 통계 요약 정보
 * PRD 2.6.3 참고
 */
export interface StatsSummary {
    /** 전체 관광지 수 */
    totalCount: number;
    /** 상위 지역 (Top 3) */
    topRegions: RegionStats[];
    /** 상위 타입 (Top 3) */
    topTypes: TypeStats[];
    /** 마지막 업데이트 시간 (ISO 8601 형식) */
    lastUpdated: string;
}

/**
 * 차트 데이터 포인트
 * recharts 등 차트 라이브러리에서 사용하는 데이터 포인트 형식
 */
export interface ChartDataPoint {
    /** 데이터 포인트 이름 (지역명 또는 타입명) */
    name: string;
    /** 데이터 포인트 값 (개수) */
    value: number;
    /** 추가 속성 (색상, 링크 등) */
    [key: string]: string | number;
}
