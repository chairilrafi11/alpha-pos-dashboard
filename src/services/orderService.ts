import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { Order } from '@/types/order/order';

export async function getOrders(params: BaseParams): Promise<PaginatedResponse<Order>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/orders?${queryString}`;
        const data = await apiFetchPaginated<Order>({
            endpoint,
            options: {
                method: 'GET',
            }
        })

        return data;
    } catch (error) {
        throw error;
    }
}