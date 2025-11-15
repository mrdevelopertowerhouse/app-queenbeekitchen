import { RecipeDetailCreateDTO } from "@/shared/dto/recipedetail.dto";
import Joi from "joi";

export class RecipeDetailRequestValidator {

    public static createRecipeDetail(data: RecipeDetailCreateDTO) {
        const recipedetailSchema = Joi.object({})


    }
}