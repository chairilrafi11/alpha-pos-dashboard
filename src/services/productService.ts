

import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Product } from '@/types/product/product';


export async function getProducts(): Promise<Product[]> {
    try {
        const endpoint = `/product`;

        const data = await apiFetch<Product[]>({
            endpoint,
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat product: ${error.message}`);
        }
        throw error;
    }
}