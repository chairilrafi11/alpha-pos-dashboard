import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { Category, CategoryDetail } from '@/types/category/category';
import { buildQueryParams } from '@/utils/urlHelpers';
import { OptionData } from '@/types/shared/optionData';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { BranchOption } from '@/types/branch/branchOption';
import { CategoryDataRequest } from '@/types/category/categoryDataRequest';


export async function getCategories(params: BaseParams): Promise<PaginatedResponse<Category>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/categories?${queryString}`;
        const data = await apiFetchPaginated<Category>({
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

export async function getCategoryDetail(categoryId: number): Promise<CategoryDetail> {
    const endpoint = `/categories/${categoryId}`;
    try {
        const data = await apiFetch<CategoryDetail>({
            endpoint,
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function createCategory(body: CategoryDataRequest): Promise<CategoryDetail> {
    const endpoint = `/categories`;
    try {
        const data = await apiFetch<CategoryDetail>({
            endpoint,
            options: {
                method: 'POST',
                body: JSON.stringify(body),
            },
            showSuccess: true,
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateCategory(categoryId: number, body: CategoryDataRequest): Promise<CategoryDetail> {
    const endpoint = `/categories/${categoryId}`;
    try {
        const data = await apiFetch<CategoryDetail>({
            endpoint,
            options: {
                method: 'PUT',
                body: JSON.stringify(body),
            },
            showSuccess: true,
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function deleteCategory(categoryId: number): Promise<boolean> {
    const endpoint = `/categories/${categoryId}`;
    try {
        const data = await apiFetch<boolean>({
            endpoint,
            options: {
                method: 'DELETE',
            },
            showSuccess: true,
        });

        return data;
    } catch (error) {
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