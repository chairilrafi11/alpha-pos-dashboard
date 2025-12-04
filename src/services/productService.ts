import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { Product, ProductDetail } from '@/types/product/product';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { buildQueryParams } from '@/utils/urlHelpers';
import { ProductDataRequest } from '@/types/product/productDataRequest';

export async function getProducts(params: BaseParams): Promise<PaginatedResponse<Product>> {
    try {
        const queryString = buildQueryParams(params);
        const endpoint = `/products?${queryString}`;
        const data = await apiFetchPaginated<Product>({
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

export async function getProductDetail(productId: number): Promise<ProductDetail> {
    const endpoint = `/products/${productId}`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function createProduct(body: ProductDataRequest): Promise<ProductDetail> {
    const endpoint = `/products`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function updateProduct(productId: number, body: ProductDataRequest): Promise<ProductDetail> {
    const endpoint = `/products/${productId}`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function deleteProduct(productId: number): Promise<boolean> {
    const endpoint = `/products/${productId}`;
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

// export async function getBranchOptions(queryString: string): Promise<OptionData[]> {
//     const params = { name: queryString, limit: 20 };
//     const endpoint = `/branches/options?${buildQueryParams(params)}`;
//     try {
//         const data = await apiFetchPaginated<BranchOption>({
//             endpoint,
//             options: {
//                 method: 'GET',
//             }
//         });
//         return data.data.map(option => ({
//             value: option.id,
//             label: `${option.name}`,
//         }))
//     } catch (error) {
//         throw error;
//     }
// }