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

export interface AreaCodeItem {
    code: string;
    name: string;
    rnum: number;
}

export interface TourItem {
    addr1: string;
    addr2?: string;
    areacode: string;
    booktour?: string;
    cat1?: string;
    cat2?: string;
    cat3?: string;
    contentid: string;
    contenttypeid: string;
    createdtime: string;
    firstimage?: string;
    firstimage2?: string;
    cpyrhtDivCd?: string;
    mapx: string;
    mapy: string;
    mlevel?: string;
    modifiedtime: string;
    sigungucode?: string;
    tel?: string;
    title: string;
    zipcode?: string;
}

export interface TourDetail {
    contentid: string;
    contenttypeid: string;
    title: string;
    createdtime: string;
    modifiedtime: string;
    tel?: string;
    telname?: string;
    homepage?: string;
    booktour?: string;
    firstimage?: string;
    firstimage2?: string;
    cpyrhtDivCd?: string;
    areacode?: string;
    sigungucode?: string;
    cat1?: string;
    cat2?: string;
    cat3?: string;
    addr1?: string;
    addr2?: string;
    zipcode?: string;
    mapx?: string;
    mapy?: string;
    mlevel?: string;
    overview?: string;
}

export interface TourIntro {
    contentid: string;
    contenttypeid: string;
    // Common fields
    heritage1?: string;
    heritage2?: string;
    heritage3?: string;
    infocenter?: string;
    opendate?: string;
    restdate?: string;
    expguide?: string;
    expagerange?: string;
    accomcount?: string;
    useseason?: string;
    usetime?: string;
    parking?: string;
    chkbabycarriage?: string;
    chkpet?: string;
    chkcreditcard?: string;
    // Type specific fields can be added as optional
    [key: string]: string | undefined;
}

export interface TourImage {
    contentid: string;
    originimgurl: string;
    imgname: string;
    smallimageurl: string;
    cpyrhtDivCd?: string;
    serialnum: string;
}

export interface PetTourInfo {
    contentid: string;
    petTours: {
        accompanyTypeCd?: string;
        accompanyTypeName?: string;
        etcInfo?: string;
        [key: string]: string | undefined;
    }[];
}

// Note: PetTourInfo structure might need adjustment based on actual API response
// The API documentation says it returns items similar to others.
// Let's assume it returns a list of pet info items or a single item with fields.
// Based on common knowledge of this API, detailPetTour2 returns items with specific fields.
export interface PetTourItem {
    contentid: string;
    petTourInfo?: string;
    // Fields from detailPetTour2
    accompanyTypeCd?: string;
    accompanyTypeName?: string;
    etcInfo?: string;
    // ... other fields
}
