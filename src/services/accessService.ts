import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { Access } from '@/types/access/access';
import { AccessDataRequest } from '@/types/access/accessDataRequest';

export async function getAccess(params: BaseParams): Promise<PaginatedResponse<Access>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/access?${queryString}`;
        const data = await apiFetchPaginated<Access>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        })
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAccessDetail(accessId: number): Promise<Access> {
    const endpoint = `/categories/${accessId}`;
    try {
        const data = await apiFetch<Access>({
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

export async function createAccess(body: AccessDataRequest): Promise<Access> {
    const endpoint = `/access`;
    try {
        const data = await apiFetch<Access>({
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

export async function updateAccess(accessId: number, body: AccessDataRequest): Promise<Access> {
    const endpoint = `/access/${accessId}`;
    try {
        const data = await apiFetch<Access>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'PUT',
                body: body,
            },
            showSuccess: false,
        });
        return data;
    } catch (error) {
        throw error;
    }
}

export async function deleteAccess(accessId: number): Promise<boolean> {
    const endpoint = `/access/${accessId}`;
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