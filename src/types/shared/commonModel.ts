export interface PageInfo {
    page_size: number;
    page_number: number;
    total_page: number;
    total_data: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    page_info: PageInfo;
}

export const initialPageInfo: PageInfo = {
    page_size: 10,
    page_number: 1,
    total_page: 1,
    total_data: 0,
};

export interface BaseParams {
    page?: number | string;
    limit?: number | string;
    search?: string | undefined;
    name?: string | undefined;
    merchant_id?: number | undefined | string;
    branch_id?: number | undefined | string;
    category_id?: number | undefined;
    status?: string | undefined;
}

export const initialBaseParams: BaseParams = {
    page: 1,
    limit: 10,
}