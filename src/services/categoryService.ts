import { apiFetch } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Category } from '@/types/category/category';

export async function getCategory(): Promise<Category[]> {
    try {
        const endpoint = `/category`;

        const data = await apiFetch<Category[]>({
            endpoint,
            options: {
                method: 'GET',
            }
        })

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat category: ${error.message}`);
        }
        throw error;
    }
}