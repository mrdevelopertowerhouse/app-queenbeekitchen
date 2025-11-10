import { HttpError } from "./httpError";

export class UnauthorizedAccessError extends HttpError {
  constructor(message: string, details?: any) {
    super(401, message, "UNAUTHORIZED_ACCESS", "UNAUTHORIZED_ACCESS_ERROR", details);
  }
}