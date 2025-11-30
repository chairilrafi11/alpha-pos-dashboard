// src/utils/currencyFormatter.ts

/**
 * Memformat angka menjadi string mata uang Rupiah (IDR).
 * @param amount Angka yang akan diformat.
 * @returns String format mata uang (misal: "Rp 100.000").
 */
export function formatIDR(amount: number | string | undefined | null): string {
    // 1. Tangani nilai null/undefined atau string kosong
    if (amount === undefined || amount === null || amount === '') {
        return 'Rp 0';
    }

    // 2. Pastikan input adalah number
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // 3. Gunakan Intl.NumberFormat
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', // Tentukan sebagai format mata uang
        currency: 'IDR',    // Kode mata uang Indonesia
        minimumFractionDigits: 0, // Tidak menampilkan desimal
        maximumFractionDigits: 0, 
    }).format(numericAmount);
}