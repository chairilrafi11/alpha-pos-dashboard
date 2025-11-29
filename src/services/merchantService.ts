

import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Merchant } from '@/types/merchant/merchant';


export async function getMerchant(): Promise<Merchant[]> {
    try {
        const endpoint = `/site`;

        const data = await apiFetch<Merchant[]>(endpoint, {
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