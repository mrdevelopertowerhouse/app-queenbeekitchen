import { HttpError } from "./httpError";

export class NotFoundError extends HttpError {
  constructor(errorCode: string, details?: any) {
    super(404, "Not Found", "NOT_FOUND", errorCode, details);
  }
}