// src/server/errors/AppPrismaError.ts
import { Prisma } from "@prisma/client";
import { ConflictError } from "../errors/ConflictError";
import { ForeignKeyViolationError } from "../errors/ForeignKeyViolationError";

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
        fields: {
            fk?: (keyof S)[]; // ✅ support foreign key violations
            unique?: { field: keyof T; message: string }[];
        }
    ): void {
        // ✅ Handle Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // 🔹 Unique constraint violation
            if (error.code === "P2002" && error.meta && "target" in error.meta) {
                const targetFields = (error.meta.target as string[]) || [];

                for (const { field, message } of fields.unique || []) {
                    if (targetFields.includes(field as string)) {
                        throw new ConflictError(
                            message,
                            `${String(field).toUpperCase()}_FIELD_VALUE_CONFLICT`
                        );
                    }
                }
            }
            // console.log("Checking for foreign key violations...", error.meta);
            // 🔹 Foreign key constraint violation
            if (error.code === "P2003" && error.meta && "field_name" in error.meta) {
                const field = (error.meta.field_name as string) || "unknown_field";
                if (fields.fk?.includes(field as keyof S)) {
                    throw new ForeignKeyViolationError({ field });
                }
            }
        }

        // Fallback — rethrow anything not handled
        throw error;
    }
}

