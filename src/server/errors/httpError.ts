export class HttpError extends Error {
    /** HTTP status code */
    public status: httpStatus
    /** Custom error code */
    public errorCode?: string | number;
    /** Type of error */
    public errorType?: string;
    /** Additional details about the error */
    public details?: any;

    constructor(
        status: httpStatus,
        message: string,
        errorType?: string,
        errorCode?: string | number,
        details?: any
    ) {
        super(message);
        this.status = status;
        this.errorType = errorType;
        this.errorCode = errorCode;
        this.details = details;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    public toJson() {
        return {
            message: this.message,
            errorType: this.errorType,
            errorCode: this.errorCode,
            details: this.details,
        };
    }
}

type httpStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;