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