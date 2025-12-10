

import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { DashboardAdminMetrics } from '@/types/dashboard/DashbordAdminMetrics';

export async function getSuperAdminMetrix(): Promise<DashboardAdminMetrics> {
    try {
        const endpoint = `/dashboard/super-admin`;

        const data = await apiFetch<DashboardAdminMetrics>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        })

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat metrix: ${error.message}`);
        }
        throw error;
    }
}