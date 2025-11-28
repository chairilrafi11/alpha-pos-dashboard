

import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { User } from '@/types/user/user';
import { BaseParams } from '@/types/shared/baseParams';


export async function getUser(): Promise<User[]> {
    try {
        // const queryString = new URLSearchParams({
        //     page: params.page.toString(),
        //     limit: params.limit.toString(),
        // }).toString();

        const endpoint = `/user`;

        const data = await apiFetch<User[]>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat statistik: ${error.message}`);
        }
        throw error;
    }
}