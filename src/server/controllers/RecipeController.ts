import { NextRequest, NextResponse } from "next/server";
import { RecipeRequestValidator } from "../validators/recipe.validator";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";
import { RecipeService } from "../services/RecipeService";
import { RequestValidator } from "../validators/validators";
import { RecipeUpdateDTO } from "@/shared/dto/recipe.dto";
import { SoftDeleteUpdateDTO } from "@/shared/dto/common.dto";



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
                }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Recipes not fecthed"
            }), { status: 500 });

        }
    }

        static async getRecipeById(id: string) {
            try {
    
                const recipeId = RequestValidator.validateNumericParam(id)
    
                const recipe = await RecipeService.getRecipeById(recipeId);
    
                return NextResponse.json(Controller.jsonResponse({
                    statusCode: recipe ? 1 : 0,
                    message: recipe ? "Recipe fetched successfully" : "Recipe not found",
                    data: recipe,
                }), { status: 200 })
    
            } catch (error) {
                if (error instanceof HttpError) {
                    return NextResponse.json(error.toJson(), { status: error.status });
                }
    
                return NextResponse.json(Controller.errorResponse({
                    error: error,
                    message: "Recipe not fetched",
                }), { status: 500 });
            }
        }


        static async updateRecipe(req: NextRequest, id: string) {

        try {

            const recipeId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as RecipeUpdateDTO;

            // 
            RecipeRequestValidator.updateRecipe(body);

            const cuisine = await RecipeService.updateRecipe(recipeId, body, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: cuisine ? 1 : 0,
                message: "Cuisine updated successfully",
                data: cuisine,
            }), { status: 200 });


        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not updated",
            }), { status: 500 });
        }
    }


    static async softDeleteRecipe(req: NextRequest, id: string) {

        try {

            const recipeId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as SoftDeleteUpdateDTO;

            RequestValidator.validateSoftDelete(body);

            const deleted = await RecipeService.softDeleteRecipe(recipeId, body.delFlag, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: deleted ? 1 : 0,
                message: deleted ? "Recipe deleted successfully" : "Recipe not found",
            }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Recipe not deleted",
            }), { status: 500 });
        }
    }
}