import { HttpError } from "./httpError";
import { UnprocessabeleEntityError } from "./UnprocessabeleEntityError";

export class ConflictError extends HttpError {
  constructor(message: string, errorCode: string, details?: any) {
    super(409, message, "CONFLICT", errorCode, details);
  }
}