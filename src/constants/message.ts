export const GlobalMessages = {
    // --- Pesan SUKSES ---
    SUCCESS: {
        DEFAULT: 'Operation completed successfully.',
        CREATED: 'Data has been successfully created.',
        UPDATED: 'Data has been successfully updated.',
        DELETED: 'Data has been successfully deleted.',
    },

    // --- Pesan ERROR/WARNING/VALIDASI ---
    VALIDATION: {
        // Digunakan untuk validasi form yang kosong/tidak lengkap
        FILL_FORM: 'Please fill out all required fields.',
        INVALID_EMAIL: 'This is an invalid email address.',
        EMAIL_EXISTS: 'Email address already exists in the system.',
    },

    ERROR: {
        // Digunakan saat terjadi error umum yang tidak diketahui
        DEFAULT: 'An error occurred. Please try again.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        SERVER_FAIL: 'Server connection failed or timed out.',
    },

    // --- Pesan INFO ---
    INFO: {
        DEFAULT: 'Information updated successfully.',
        LOADING: 'Loading data, please wait...',
    }
};