import { LanguageCreateDTO, LanguageUpdateDTO } from "@/shared/dto/language.dto";
import Joi from "joi";
import { BadRequestError } from "../errors/BadRequestError";

export class LanguageRequestValidator {

    /**
     * 
     * Use case: Create request body validation
     * 
     * Request body validation:
     * - Validate name is string and required
     * - Validate isocode is string and required
     * 
     * @returns true if valid, false otherwise
     * 
     * @throws BadRequestError extending HttpError if validation fails
     */
    public static createLanguage(data: LanguageCreateDTO): void {

        const languageSchema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(191)
                .trim() // ✅ Removes leading and trailing spaces
                .required()
                .messages({
                    "string.empty": "Language name is required",
                    "string.min": "Language name must be at least 1 character long",
                    "string.max": "Language name must not exceed 191 characters",
                }),
            isoCode: Joi.string()
                .min(1)
                .max(10)
                .trim() // ✅ Removes leading and trailing spaces
                .required()
                .messages({
                    "string.empty": "ISO Code is required",
                    "string.min": "ISO Code must be at least 1 character long",
                    "string.max": "ISO Code must not exceed 10 characters",
                }),
        });
        const { error } = languageSchema.validate(data, { abortEarly: false });

        if (error)
            throw new BadRequestError(error);
    }


    /**
     * 
     * Use case: Update request body validation
     * 
     * Request body validation:
     * - Validate name is string and required
     * - Validate isocode is string and required
     * 
     * @returns true if valid, false otherwise
     * 
     * @throws BadRequestError extending HttpError if validation fails
     */
    public static updateLanguage(data: LanguageUpdateDTO): void {

        const languageSchema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(191)
                .trim() // ✅ Removes leading and trailing spaces
                .required()
                .messages({
                    "string.empty": "Language name is required",
                    "string.min": "Language name must be at least 1 character long",
                    "string.max": "Language name must not exceed 191 characters",
                }),
            isoCode: Joi.string()
                .min(1)
                .max(10)
                .trim() // ✅ Removes leading and trailing spaces
                .required()
                .messages({
                    "string.empty": "ISO Code is required",
                    "string.min": "ISO Code must be at least 1 character long",
                    "string.max": "ISO Code must not exceed 10 characters",
                }),
        });
        const { error } = languageSchema.validate(data, { abortEarly: false });

        if (error)
            throw new BadRequestError(error);
    }

}