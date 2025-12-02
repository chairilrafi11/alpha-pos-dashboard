import { apiFetch } from '@/utils/apiClient';
import { User } from '@/types/user/user';

export async function getUser(): Promise<User[]> {
    try {

        const endpoint = `/user`;

        const data = await apiFetch<User[]>({
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