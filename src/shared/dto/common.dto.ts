import { Pagination } from "../types/pagination";

export interface ResponseDTO<T = any> {
    statusCode: 0 | 1;
    statusMessage: string;
    data?: T | T[] | null;
    pagination?: Pagination | null;
}

export interface SoftDeleteUpdateDTO {
    delFlag: boolean;
}