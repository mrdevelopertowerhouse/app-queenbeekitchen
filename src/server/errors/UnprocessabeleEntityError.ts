import { HttpError } from "./httpError";

export class UnprocessabeleEntityError extends HttpError {
  constructor(errorCode: string, message: string, details?: { [key: string]: any }) {
    super(422, message, "UNPROCESSABELE_ENTITY", errorCode, details);
  }
}