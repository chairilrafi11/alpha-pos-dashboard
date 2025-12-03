import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { Merchant } from '@/types/merchant/merchant';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { MerchantDetail } from '@/types/merchant/merchantDetail';
import { MerchantCreateRequest } from '@/types/merchant/merchantCreateRequest';
import { User } from '@/types/user/user';
import { OptionData } from '@/types/shared/optionData';

export async function getMerchants(params: BaseParams): Promise<PaginatedResponse<Merchant>> {
    const queryString = buildQueryParams(params);
    const endpoint = `/merchants?${queryString}`;
    try {
        const data = await apiFetchPaginated<Merchant>({
            endpoint,
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getMerchantDetail(id: number): Promise<MerchantDetail> {
    const endpoint = `/merchants/${id}`;
    try {
        const data = await apiFetch<MerchantDetail>({
            endpoint,
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function createMerchant(body: MerchantCreateRequest): Promise<Merchant> {
    const endpoint = `/merchants`;
    try {
        const data = await apiFetch<Merchant>({
            endpoint,
            options: {
                method: 'POST',
                body: JSON.stringify(body),
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getMerchantOptions(query: string): Promise<OptionData[]> {
    try {
        const queryString = buildQueryParams({ name: query });
        const endpoint = `/merchants?${queryString}`;

        const data = await apiFetchPaginated<User>({
            endpoint,
            options: {
                method: 'GET',
            }
        });
        return data.data.map(option => ({
            value: option.id,
            label: `${option.name}`,
        }));
    } catch (error) {
        throw error;
    }
}