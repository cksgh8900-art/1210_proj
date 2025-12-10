export interface RegionStats {
    areaCode: string;
    areaName: string;
    count: number;
}

export interface TypeStats {
    contentTypeId: string;
    typeName: string;
    count: number;
    percentage: number;
}

export interface StatsSummary {
    totalCount: number;
    topRegions: RegionStats[];
    topTypes: TypeStats[];
    lastUpdated: string;
}

// Helper types for chart data
export interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}
