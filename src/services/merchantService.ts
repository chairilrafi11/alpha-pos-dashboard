

import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Merchant } from '@/types/merchant/merchant';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { MerchantDetail } from '@/types/merchant/merchantDetail';
import { Site } from '@/types/merchant/site';
import { MerchantCreateRequest } from '@/types/merchant/merchantCreateRequest';

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

export async function getMerchantDetail(id: number): Promise<MerchantDetail> {
    const endpoint = `/merchant/${id}`;
    try {
        const data = await apiFetch<MerchantDetail>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat merchant detail: ${error.message}`);
        }
        throw error;
    }
}

export async function getMerchantSites(id: number, params: BaseParams): Promise<PaginatedResponse<Site>> {
    const queryString = buildQueryParams(params);
    const endpoint = `/merchant/${id}/sites?${queryString}`;
    try {
        const data = await apiFetchPaginated<Site>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat merchant sites: ${error.message}`);
        }
        throw error;
    }
}
export async function createMerchant(body: MerchantCreateRequest): Promise<Site> {
    const endpoint = `/merchant`;
    try {
        const data = await apiFetch<Site>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat merchant sites: ${error.message}`);
        }
        throw error;
    }
}