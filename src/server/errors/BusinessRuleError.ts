import { HttpError } from "./httpError";

export class BusinessRuleError extends HttpError {
  constructor(errorCode: string, message: string, details?: { [key: string]: any }) {
    super(422, message, "BUSINESS_RULE_ERROR", errorCode, details);
  }
} 