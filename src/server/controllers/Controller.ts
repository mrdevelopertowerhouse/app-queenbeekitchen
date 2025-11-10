import { ResponseDTO } from "@/shared/dto/common.dto";
import { Pagination } from "@/shared/types/pagination";

export class Controller {
    // Base controller class can have common methods or properties for all controllers

    public static jsonResponse(res: { statusCode: 0 | 1, message: string, data?: { [key: string]: any } | { [key: string]: any }[] | any, pagination?: Pagination }): ResponseDTO {

        const response: ResponseDTO = {
            statusCode: res.statusCode,
            statusMessage: res.message,
        };
        if (res.data) response.data = res.data;
        if (res.pagination) response.pagination = res.pagination;

        return response;
    }

    public static errorResponse(err: { message: string, error: Error | unknown }) {
        if (process.env.DEBUG === 'true')
            return { message: err.message || 'Something went wrong', error: err.error };
        else
            return { message: err.message || 'Something went wrong' };
    }
}