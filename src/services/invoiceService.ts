import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { Invoice } from '@/types/invoice/invoice';


export async function getInvoices(params: BaseParams): Promise<PaginatedResponse<Invoice>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/invoices?${queryString}`;
        const data = await apiFetchPaginated<Invoice>({
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

// export async function getCategoryDetail(categoryId: number): Promise<CategoryDetail> {
//     const endpoint = `/categories/${categoryId}`;
//     try {
//         const data = await apiFetch<CategoryDetail>({
//             endpoint,
//             options: {
//                 method: 'GET',
//             }
//         });

//         return data;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function createCategory(body: CategoryDataRequest): Promise<CategoryDetail> {
//     const endpoint = `/categories`;
//     try {
//         const data = await apiFetch<CategoryDetail>({
//             endpoint,
//             options: {
//                 method: 'POST',
//                 body: JSON.stringify(body),
//             },
//             showSuccess: true,
//         });

//         return data;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function updateCategory(categoryId: number, body: CategoryDataRequest): Promise<CategoryDetail> {
//     const endpoint = `/categories/${categoryId}`;
//     try {
//         const data = await apiFetch<CategoryDetail>({
//             endpoint,
//             options: {
//                 method: 'PUT',
//                 body: JSON.stringify(body),
//             },
//             showSuccess: true,
//         });

//         return data;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function deleteCategory(categoryId: number): Promise<boolean> {
//     const endpoint = `/categories/${categoryId}`;
//     try {
//         const data = await apiFetch<boolean>({
//             endpoint,
//             options: {
//                 method: 'DELETE',
//             },
//             showSuccess: true,
//         });

//         return data;
//     } catch (error) {
//         throw error;
//     }
// }