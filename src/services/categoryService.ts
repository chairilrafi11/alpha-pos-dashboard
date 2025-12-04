import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Category } from '@/types/category/category';
import { buildQueryParams } from '@/utils/urlHelpers';
import { OptionData } from '@/types/shared/optionData';
import { BaseParams } from '@/types/shared/commonModel';
import { BranchOption } from '@/types/branch/branchOption';


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

export async function getCategoryOptions(params: BaseParams): Promise<OptionData[]> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/categories/options?${queryString}`;
        const result = await apiFetchPaginated<BranchOption>({
            endpoint,
            options: {
                method: 'GET',
            }
        });
        return result.data.map(option => ({
            value: option.id,
            label: `${option.name}`,
        }))
    } catch (error) {
        throw error;
    }
}