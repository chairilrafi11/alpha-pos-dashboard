import { apiFetchPaginated } from '@/utils/apiClient';
import { PaginatedResponse } from '@/types/shared/commonModel';
import { Role } from '@/types/role/role';

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