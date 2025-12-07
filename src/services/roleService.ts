import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { PaginatedResponse } from '@/types/shared/commonModel';
import { Role } from '@/types/role/role';
import { RoleAccess } from '@/types/role/roleAccess';
import { RoleAccessDataRequest } from '@/types/role/roleAccessDataRequest';

export async function getRoles(): Promise<PaginatedResponse<Role>> {
    try {
        const endpoint = `/roles`;
        const data = await apiFetchPaginated<Role>({
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

export async function getRoleAccess(roleId: number): Promise<PaginatedResponse<RoleAccess>> {
    try {
        const endpoint = `/role-access/${roleId}`;
        const data = await apiFetchPaginated<RoleAccess>({
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

export async function syncRoleAccess(roleId: number, request: RoleAccessDataRequest): Promise<boolean> {
    try {
        const endpoint = `/role-access/${roleId}`;
        const data = await apiFetch<boolean>({
            endpoint,
            options: {
                method: 'PUT',
                body: JSON.stringify(request),
            },
            showSuccess: true
        })

        return data;
    } catch (error) {
        throw error;
    }
}