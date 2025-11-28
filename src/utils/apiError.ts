export class ApiError extends Error {
    responseCode: string;
    httpStatus: number;
    details: any;

    constructor(message: string, responseCode: string, httpStatus: number, details: any = {}) {
        super(message);
        this.name = 'ApiError';
        this.responseCode = responseCode;
        this.httpStatus = httpStatus;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}