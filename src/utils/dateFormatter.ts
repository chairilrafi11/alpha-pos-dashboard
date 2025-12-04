// src/utils/dateFormatter.ts

export function formatDay(dateStr: string): string {
    if (!dateStr || typeof dateStr !== 'string') return '';

    // Pastikan format string adalah YYYY-MM-DD
    const parts = dateStr.split('-');

    if (parts.length !== 3) return dateStr;

    // parts[2] = Hari (DD), parts[1] = Bulan (MM)
    const day = parts[2];
    const monthNumber = parseInt(parts[1], 10); // Menghilangkan nol di depan bulan

    return `${day}`;
}

/**
 * Memformat string tanggal (ISO 8601) menjadi format 'dd-mm-yyyy'.
 * * @param dateStr String tanggal (misal: "2025-08-23T08:01:53+07:00")
 * @returns String tanggal terformat (misal: "23-08-2025") atau string kosong jika invalid.
 */
export function dateFormatDDMMYYYY(dateStr: string | null | undefined): string {
    if (!dateStr || typeof dateStr !== 'string') return '';

    try {
        const date = new Date(dateStr);

        // Cek apakah tanggal valid
        if (isNaN(date.getTime())) {
            return '';
        }

        const day = date.getDate().toString().padStart(2, '0');
        // getMonth() dimulai dari 0 (Januari = 0), jadi perlu ditambah 1
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return '';
    }
}

/**
 * Memformat string tanggal (ISO 8601) menjadi format 'dd MMM yyyy' (misal: 23 Agu 2025).
 * Berguna untuk tampilan UI yang lebih ramah.
 */
export function dateFormatReadable(dateStr: string | null | undefined): string {
    if (!dateStr || typeof dateStr !== 'string') return '';

    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        // Menggunakan Intl.DateTimeFormat untuk lokalisasi Indonesia
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    } catch (error) {
        return '';
    }
}