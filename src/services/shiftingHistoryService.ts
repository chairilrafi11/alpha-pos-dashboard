import { apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { ShiftingHistory } from '@/types/shifting-history/shifting-history';

export async function getShiftingHistories(params: BaseParams): Promise<PaginatedResponse<ShiftingHistory>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/shifting-histories?${queryString}`;
        const data = await apiFetchPaginated<ShiftingHistory>({
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