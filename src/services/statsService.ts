

import { apiFetch } from '@/utils/apiClient';
import { TransactionStat, TransactionStatsParams } from '@/types/stats/monthlyTransactionStats';
import { ApiError } from '@/utils/apiError';
import toast from 'react-hot-toast';
import { TopProduct } from '@/types/stats/topProduct';

/**
 * Mengambil data statistik transaksi bulanan.
 */
export async function getTransactionStats(params: TransactionStatsParams): Promise<TransactionStat[]> {
    try {
        // Konstruksi query string
        const queryString = new URLSearchParams({
            site_id: params.site_id.toString(),
            start_time: params.start_time,
            end_time: params.end_time,
        }).toString();

        const endpoint = `/stats-transaction?${queryString}`;

        // apiFetch menangani token dan error code '00'
        const data = await apiFetch<TransactionStat[]>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat statistik: ${error.message}`);
        }
        throw error; // Lempar ulang agar UI bisa menangani loading state
    }
}

export async function getTopProducts(params: TransactionStatsParams): Promise<TopProduct[]> {
    try {
        // Konstruksi query string
        const queryString = new URLSearchParams({
            site_id: params.site_id.toString(),
            start_time: params.start_time,
            end_time: params.end_time,
        }).toString();

        const endpoint = `/stats-top-product?${queryString}`;

        const data = await apiFetch<TopProduct[]>(endpoint, {
            method: 'GET',
        });

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(`Gagal memuat statistik: ${error.message}`);
        }
        throw error; // Lempar ulang agar UI bisa menangani loading state
    }
}