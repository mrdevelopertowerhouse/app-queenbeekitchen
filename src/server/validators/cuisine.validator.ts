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
            name: Joi.string().required(),
            description: Joi.string().optional(),

        });

        const { error } = cuisineSchema.validate(data, { abortEarly: false });

        if (error)
            throw new BadRequestError(error);
    }
}

