import { RecipeController } from "@/server/controllers/RecipeController";
import { NextRequest } from "next/server";


/**
 * @route   POST /api/recipes
 * @desc    Create a new recipe
 * @access  Authenticated (replace static user later)
 */

// ✅ POST /api/recipes
export async function POST(req: NextRequest) {
    return await RecipeController.createRecipe(req);
}

export async function GET() {
    return await RecipeController.getAllRecipes();
}