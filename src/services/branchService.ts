import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { Branch, BranchDetail } from '@/types/branch/branch';
import { BranchDataRequest } from '@/types/branch/branchCreateRequest';
import { BranchOption } from '@/types/branch/branchOption';
import { OptionData } from '@/types/shared/optionData';

export async function getBranches(merchantId: number, params: BaseParams): Promise<PaginatedResponse<Branch>> {
    const queryString = buildQueryParams(params);
    const endpoint = `/merchants/${merchantId}/branches?${queryString}`;
    try {
        const data = await apiFetchPaginated<Branch>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getBranchDetail(merchantId: number, branchId: number): Promise<BranchDetail> {
    const endpoint = `/merchants/${merchantId}/branches/${branchId}`;
    try {
        const data = await apiFetch<BranchDetail>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function createBranch(merchantId: number, body: BranchDataRequest): Promise<Branch> {
    const endpoint = `/merchants/${merchantId}/branches`;
    try {
        const data = await apiFetch<Branch>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'POST',
                body: body,
            },
            showSuccess: true,
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateBranch(merchantId: number, branchId: number, body: BranchDataRequest): Promise<BranchDetail> {
    const endpoint = `/merchants/${merchantId}/branches/${branchId}`;
    try {
        const data = await apiFetch<BranchDetail>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'PUT',
                body: body,
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
            endpointRoleType: 'admin',
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

export async function getBranchOptions(params: BaseParams): Promise<OptionData[]> {
    const endpoint = `/branches/options?${buildQueryParams(params)}`;
    try {
        const data = await apiFetchPaginated<BranchOption>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        });
        return data.data.map(option => ({
            value: option.id,
            label: `${option.name}`,
        }))
    } catch (error) {
        throw error;
    }
}