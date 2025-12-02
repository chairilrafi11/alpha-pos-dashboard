

import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { SuperAdminMetrix } from '@/types/dashboard/SuperAdminMetrix';

export async function getSuperAdminMetrix(): Promise<SuperAdminMetrix> {
    try {
        const endpoint = `/dashboard/super-admin`;

        const data = await apiFetch<SuperAdminMetrix>({
            endpoint,
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