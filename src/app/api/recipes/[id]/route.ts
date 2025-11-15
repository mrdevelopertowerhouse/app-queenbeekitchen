import { RecipeController } from "@/server/controllers/RecipeController";
import { NextRequest } from "next/server";

/**
 * ✅ GET /api/recipes/:id
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await RecipeController.getRecipeById(id);
}

/**
 * ✅ PUT /api/recipes/:id
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await RecipeController.updateRecipe(req, id);
}

/**
 * ✅ PATCH /api/cuisines/:id
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    return await RecipeController.softDeleteRecipe(req, id);
}


