// src/server/errors/AppPrismaError.ts
import { Prisma } from "@prisma/client";
import { ConflictError } from "../errors/ConflictError";
import { ForeignKeyViolationError } from "../errors/ForeignKeyViolationError";
import { NotFoundError } from "./NotFoundError";

/**
 * Handles known Prisma errors (e.g., unique constraint or foreign key violations)
 */
export class AppPrismaError {
    private constructor() { }

    /**
     * Handles PrismaClientKnownRequestError errors (P2002: unique, P2003: FK)
     *
     * @template S - The Prisma model (e.g., m_cuisine)
     * @template T - The constraint type interface (e.g., CuisineUniqueConstraints)
     */
    public static handle<S, T>(
        error: unknown,
        errorMap: {
            /** Foreign Key constraint: Model property names used to detect Foreign Key constraint errors (P2003) */
            fk?: (keyof S)[];
            /** Unique constraint mappings: model property -> user-friendly message (used for P2002) */
            unique?: { field: keyof T; message: string }[];
            /** Record not found: Map P2025 (record not found) to an application error code */
            notFound?: { errorCode: string };
        }
    ): void {
        // ✅ Handle Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // 🔹 Unique constraint violation (P2002)
            if (error.code === "P2002" && error.meta && "target" in error.meta) {
                const targetFields = (error.meta.target as string[]) || [];

                for (const { field, message } of errorMap.unique || []) {
                    if (targetFields.includes(field as string)) {
                        throw new ConflictError(
                            message,
                            `${String(field).toUpperCase()}_FIELD_VALUE_CONFLICT`
                        );
                    }
                }
            }

            // 🔹 Foreign key constraint violation (P2003)
            if (error.code === "P2003" && error.meta && "field_name" in error.meta) {
                const field = (error.meta.field_name as string) || "unknown_field";
                if (errorMap.fk?.includes(field as keyof S)) {
                    throw new ForeignKeyViolationError({ field });
                }
            }

            // 🔹 Record not found (P2025) → map to NotFoundError
            if (error.code === "P2025" && errorMap.notFound) {
                throw new NotFoundError(errorMap.notFound.errorCode);
            }
        }

        // Fallback — rethrow anything not handled
        throw error;
    }
}

