import { HttpError } from "./httpError";

export class BadRequestError extends HttpError {
  constructor(details?: any) {
    super(400, "INVALID REQUEST", "BAD_REQUEST", "REQUEST_BODY_VALIDATION_ERROR", details);
  }
}