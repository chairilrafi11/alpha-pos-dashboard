import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { User } from '@/types/user/user';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { UserDetail } from '@/types/user/userDetail';
import { UserDataRequest } from '@/types/user/userDataRequest';
import { UserEmailAvailability } from '@/types/user/userEmailAvaibility';

export async function getUsers(params: BaseParams): Promise<PaginatedResponse<User>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/users?${queryString}`;

        const data = await apiFetchPaginated<User>({
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

export async function getUserDetail(id: number): Promise<UserDetail> {
    const endpoint = `/users/${id}`;
    try {
        const data = await apiFetch<UserDetail>({
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

export async function createUser(body: UserDataRequest): Promise<User> {
    const endpoint = `/users`;
    try {
        const data = await apiFetch<User>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'POST',
                body: body,
            },
            showSuccess: true
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(id: number, body: UserDataRequest): Promise<User> {
    const endpoint = `/users/${id}`;
    try {
        const data = await apiFetch<User>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'PUT',
                body: body,
            },
            showSuccess: true
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
            endpointRoleType: 'admin',
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

export async function checkUserEmailAvailability(email: string): Promise<boolean> {
    const endpoint = `/users/check-email-availability?email=${email}`;
    try {
        const data = await apiFetch<UserEmailAvailability>({
            endpoint,
            endpointRoleType: 'admin',
            options: {
                method: 'GET',
            }
        });
        return data.is_available
    } catch (error) {
        throw error;
    }
}