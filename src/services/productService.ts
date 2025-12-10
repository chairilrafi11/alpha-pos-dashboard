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

export async function getProductDetail(productId: number): Promise<ProductDetail> {
    const endpoint = `/products/${productId}`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function createProduct(body: ProductDataRequest): Promise<ProductDetail> {
    const endpoint = `/products`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function updateProduct(productId: number, body: ProductDataRequest): Promise<ProductDetail> {
    const endpoint = `/products/${productId}`;
    try {
        const data = await apiFetch<ProductDetail>({
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

export async function deleteProduct(productId: number): Promise<boolean> {
    const endpoint = `/products/${productId}`;
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