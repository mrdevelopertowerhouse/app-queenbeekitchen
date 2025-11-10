import { HttpError } from "./httpError";

export class BadRequestQueryError extends HttpError {
  constructor(details: {
    key: 'sort' | 'page[number]' | 'page[size]' | 'filter' | 'filter[field]' | 'filter[field][operator]' | 'filter[field][operator]=value' | 'filter[q]' | 'filter[searchFields]',
    message: string
  }) {
    super(400, "INVALID REQUEST", "BAD_REQUEST", "REQUEST_QUERY_VALIDATION_ERROR", details);
  }
}