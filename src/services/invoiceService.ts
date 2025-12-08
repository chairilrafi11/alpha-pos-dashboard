import { apiFetch, apiFetchPaginated } from '@/utils/apiClient';
import { buildQueryParams } from '@/utils/urlHelpers';
import { BaseParams, PaginatedResponse } from '@/types/shared/commonModel';
import { Invoice, InvoiceDetail } from '@/types/invoice/invoice';

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

export async function getInvoiceDetail(invoiceId: number): Promise<InvoiceDetail> {
    const endpoint = `/invoices/${invoiceId}`;
    try {
        const data = await apiFetch<InvoiceDetail>({
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