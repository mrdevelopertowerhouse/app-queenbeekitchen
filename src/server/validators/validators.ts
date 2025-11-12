import Joi from "joi";
import { BadRequestError } from "../errors/BadRequestError";
import { SoftDeleteUpdateDTO } from "@/shared/dto/common.dto";

export class RequestValidator {

    /**
    * Validate a route parameter and ensure it's a number.
    * Throws an error if invalid.
    */
    public static validateNumericParam(value: unknown): number {
        const schema = Joi.number().integer().positive().required();

        const { error, value: parsed } = schema.validate(value, { convert: true });
        if (error) {
            throw new BadRequestError(error);
        }
        return parsed as number;
    }

    /**
     * Validate soft delete update DTO
     * @param data  SoftDeleteUpdateDTO
     * @throws BadRequestError if validation fails
     */
    public static validateSoftDelete(data: SoftDeleteUpdateDTO): void {
        const cuisineSchema = Joi.object({
            delFlag: Joi.boolean()
                .required()
                .messages({
                    "any.required": "delFlag is required",
                    "boolean.base": "delFlag must be a boolean",
                })
        });
        const { error } = cuisineSchema.validate(data, { abortEarly: false });

        if (error)
            throw new BadRequestError(error);
    }

}