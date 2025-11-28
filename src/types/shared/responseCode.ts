export enum ResponseCode {
    SUCCESS = '00',
    FAILED = '01',
    FORBIDDEN = '02',
    UNAUTHORIZED = '04', // Penting untuk penanganan token/redirect
    
    // Opsional: Tambahkan kode error internal untuk klien
    CLIENT_HTTP_ERROR = '99', // Digunakan di apiClient.ts
    CLIENT_PARSE_ERROR = '98', // Digunakan di apiClient.ts
}