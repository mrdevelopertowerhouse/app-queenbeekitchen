import { HttpError } from "./httpError";

export class ForbiddenError extends HttpError {
  constructor(message: string, details?: any) {
    super(403, message, "FORBIDDEN", 'FORBIDDEN', details);
  }
}