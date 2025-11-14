import { RecipeCreateDTO } from "@/shared/dto/recipe.dto";
import Joi from "joi";

export class RecipeRequestValidator {

    public static createRecipe(data: RecipeCreateDTO): void {

        const recipeSchema = Joi.object({
            cuisineId: Joi.number().integer().positive().required(),
            categoryId: Joi.number().integer().positive().required(),
            foodtypeId: Joi.number().integer().positive().required(),
            uuid: Joi.string().min(12).max(12).required(),
            title: Joi.string().min(1).max(191).required(),
            imageUrl: Joi.string().uri().min(1).max(191).allow(null, "").optional(),
            videoUrl: Joi.string().uri().min(1).max(191).allow(null, "").optional(),
            details: Joi.array()
                .items(
                    Joi.object({
                        languageId: Joi.number().integer().positive().required(),

                        name: Joi.string().max(191).required(),

                        instructions: Joi.string().required(),

                        ingredients: Joi.string().required()
                    })
                )
                .min(1)
                .required()
        });


    }
}