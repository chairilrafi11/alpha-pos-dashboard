import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { Branch } from '@/types/branch/branch';
import { BranchCreateRequest } from '@/types/branch/branchCreateRequest';

export async function getBranches(merchantId: number, params: BaseParams): Promise<PaginatedResponse<Branch>> {
    const queryString = buildQueryParams(params);
    const endpoint = `/merchants/${merchantId}/branches?${queryString}`;
    try {
        const data = await apiFetchPaginated<Branch>({
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

export async function createBranch(merchantId: number, body: BranchCreateRequest): Promise<Branch> {
    const endpoint = `/merchants/${merchantId}/branches`;
    try {
        const data = await apiFetch<Branch>({
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

export async function deleteBranch(merchantId: number, branchId: number): Promise<boolean> {
    const endpoint = `/merchants/${merchantId}/branches/${branchId}`;
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