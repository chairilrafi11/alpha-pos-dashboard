import { apiFetch } from '@/utils/apiClient';
import { DashboardGroupMetrics } from '@/types/dashboard/DashboardGroupMetrics';
import { DashboardDataRequest } from '@/types/dashboard/DashboardDataRequest';

export async function getDashboardGroupMetrics(params: DashboardDataRequest): Promise<DashboardGroupMetrics> {
    try {
        const endpoint = `/dashboard`;
        const data = await apiFetch<DashboardGroupMetrics>({
            endpoint,
            params: params,
            endpointRoleType: 'client',
            options: {
                method: 'GET',
            }
        })
        return data;
    } catch (error) {
        throw error;
    }
}