import { RecipeDetailCreateDTO } from "@/shared/dto/recipedetail.dto";
import { NextRequest } from "next/server";
import { RecipeDetailRequestValidator } from "../validators/recipedetail.validator";

export class RecipeDetailCOntroller {
    static async createRecipe(req:NextRequest) {
        try {

             // ✅ Parse the request body first
             const body = await req.json() as RecipeDetailCreateDTO;

             // ✅ Validate the body after parsing
             RecipeDetailRequestValidator.createRecipeDetail(body);

        } catch (error) {

        }
    }
}