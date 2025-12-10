import { apiFetch } from '@/utils/apiClient';
import { TransactionStat, TransactionStatsParams } from '@/types/stats/monthlyTransactionStats';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { TopProduct } from '@/types/dashboard/DashbordAdminMetrics';

export async function getTransactionStats(params: TransactionStatsParams): Promise<TransactionStat[]> {
    try {
        const queryString = new URLSearchParams({
            site_id: params.site_id.toString(),
            start_time: params.start_time,
            end_time: params.end_time,
        }).toString();

        const endpoint = `/stats-transaction?${queryString}`;

        const data = await apiFetch<TransactionStat[]>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            },
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getTopProducts(params: TransactionStatsParams): Promise<TopProduct[]> {
    try {
        const queryString = new URLSearchParams({
            site_id: params.site_id.toString(),
            start_time: params.start_time,
            end_time: params.end_time,
        }).toString();

        const endpoint = `/stats-top-product?${queryString}`;

        const data = await apiFetch<TopProduct[]>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            },
        });

        return data;
    } catch (error) {
        throw error;
    }
}