import { NextRequest, NextResponse } from "next/server";
import { RecipeRequestValidator } from "../validators/recipe.validator";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";
import { RecipeService } from "../services/RecipeService";



export class RecipeController {

    static async createRecipe(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json();

            // ✅ Validate the body after parsing
            RecipeRequestValidator.createRecipe(body);

            const recipe = await RecipeService.createRecipe(body, 1);

            // ✅ Return only selected fields
            const responseData = {
                id: recipe.id,
                cuisineId: recipe.cuisineId,
                categoryId: recipe.categoryId,
                foodTypeId: recipe.foodTypeId,
                titleName: recipe.titleName,
            };

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: responseData ? 1 : 0,
                    message: responseData ? "Recipe created successfully" : "Failed to create recipe",
                    data: responseData,
                }),
                { status: 201 }
            );

        } catch (error: unknown) {
            console.error("🔥 Controller error in createRecipe:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(
                Controller.errorResponse({
                    error: error,
                    message: "Failed to create recipe",
                }),
                { status: 500 }
            );
        }
    }

    static async getAllRecipes() {
        try {

            const recipes = await RecipeService.getAllRecipes();

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: recipes && recipes.length > 0 ? 1 : 0,
                    message: recipes && recipes.length > 0 ? "Recipes fetched successfully" : "No recipes found",
                    data: recipes,
                }), { status: 500 }
            );

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Recipes not fecthed"
            }), { status: 500 })

        }
    }
}