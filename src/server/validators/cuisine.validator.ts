import Joi from "joi";
import { BadRequestError } from "../errors/BadRequestError";
import { CuisineCreateDTO } from "@/shared/dto/cuisine.dto";

export class RequestValidator {

    /**
     * 
     * Use case: Create request body validation
     * 
     * Request body validation:
     * - Validate name is string and required
     * - Validate description is string and optional
     * 
     * @returns true if valid, false otherwise
     * 
     * @throws BadRequestError extending HttpError if validation fails
     */
    public static createCuisine(data: CuisineCreateDTO): void {

        const cuisineSchema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(191)
                .trim() // ✅ Removes leading and trailing spaces
                .required()
                .messages({
                    "string.empty": "Cuisine name is required",
                    "string.min": "Cuisine name must be at least 1 character long",
                    "string.max": "Cuisine name must not exceed 191 characters",
                }),

            description: Joi.string()
                .optional()
                .trim() // ✅ Removes leading/trailing spaces if provided
                .max(500)
                .messages({
                    "string.max": "Description must not exceed 500 characters",
                }),
        });
        const { error } = cuisineSchema.validate(data, { abortEarly: false });

        if (error)
            throw new BadRequestError(error);
    }
}

