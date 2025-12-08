import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { Order, OrderDetail } from '@/types/order/order';

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

export async function getOrderDetail(id: number): Promise<OrderDetail> {
    const endpoint = `/orders/${id}`;
    try {
        const data = await apiFetch<OrderDetail>({
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