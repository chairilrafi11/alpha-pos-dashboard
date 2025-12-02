import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { User } from '@/types/user/user';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';

export async function getUsers(params: BaseParams): Promise<PaginatedResponse<User>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/users?${queryString}`;

        const data = await apiFetchPaginated<User>({
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

export async function getUserDetail(id: number): Promise<User> {
    const endpoint = `/users/${id}`;
    try {
        const data = await apiFetch<User>({
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

export async function createUser(body: User): Promise<User> {
    const endpoint = `/users`;
    try {
        const data = await apiFetch<User>({
            endpoint,
            options: {
                method: 'POST',
                body: JSON.stringify(body),
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(id: number, body: User): Promise<User> {
    const endpoint = `/users/${id}`;
    try {
        const data = await apiFetch<User>({
            endpoint,
            options: {
                method: 'PUT',
                body: JSON.stringify(body),
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id: number): Promise<boolean> {
    const endpoint = `/users/${id}`;
    try {
        const data = await apiFetch<boolean>({
            endpoint,
            options: {
                method: 'DELETE',
            },
            showSuccess: true
        });
        return data
    } catch (error) {
        throw error;
    }
}