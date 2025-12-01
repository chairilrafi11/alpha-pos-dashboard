

import {  apiFetchPaginated } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Merchant } from '@/types/merchant/merchant';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';


export async function getMerchants(params: BaseParams): Promise<PaginatedResponse<Merchant>> {
    const queryString = buildQueryParams(params);
    const endpoint = `/merchant?${queryString}`;
    try {
        const data = await apiFetchPaginated<Merchant>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat merchant: ${error.message}`);
        }
        throw error;
    }
}