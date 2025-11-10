import { HttpError } from "./httpError";
import { UnprocessabeleEntityError } from "./UnprocessabeleEntityError";

/**
 * Error representing a foreign key violation, typically when a referenced entity is not found.
 * This error results in a 404 Not Found HTTP response.
 * 
 * @extends HttpError
 */
export class ForeignKeyViolationError extends HttpError {
  constructor(details: { field: string }) {
    super(404, "Not Found", "NOT_FOUND", 'FIELD_VALUE_NOT_FOUND', details);
  }
}