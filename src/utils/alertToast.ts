import { toast } from 'react-hot-toast'; 

interface ToastProps {
    type: 'error' | 'warning' | 'info' | 'success';
    message?: string; // Tanda '?' menunjukkan bahwa properti ini opsional (bisa undefined)
}

/**
 * Menampilkan notifikasi toast dengan tipe dan pesan yang spesifik.
 * Pesan default akan digunakan jika 'message' tidak disediakan.
 * * @param {ToastProps} { type, message } - Tipe dan pesan notifikasi.
 */
export function showToast({ type, message }: ToastProps) {
    let finalMessage: string;

    switch (type) {
        case 'error':
            // Jika 'message' null atau undefined, gunakan pesan default
            finalMessage = message ?? 'An error occurred. Please try again.';
            toast.error(finalMessage);
            break;

        case 'warning':
            // Jika 'message' null atau undefined, gunakan pesan default
            finalMessage = message ?? 'Action required or critical information.';
            // Asumsi toast.custom adalah untuk menampilkan warning/info yang non-standar
            toast.custom(finalMessage); 
            break;

        case 'info':
            // Jika 'message' null atau undefined, gunakan pesan default
            finalMessage = message ?? 'Information updated successfully.';
            toast.custom(finalMessage); 
            break;

        case 'success':
            // Jika 'message' null atau undefined, gunakan pesan default
            finalMessage = message ?? 'Operation completed successfully.';
            toast.success(finalMessage);
            break;
    }
}