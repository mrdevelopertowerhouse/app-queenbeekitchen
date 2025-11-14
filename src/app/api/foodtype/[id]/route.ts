import { NextRequest, NextResponse } from "next/server";
import FoodTypeService from "@/server/services/FoodTypeService";
import { FoodTypeController } from "@/server/controllers/FoodTypeController";


/**
 * ✅ GET /api/foodtypes/:id
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await FoodTypeController.getFoodTypeById(id);
}

/**
 * ✅ PUT /api/foodtypes/:id
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await FoodTypeController.updateFoodType(req, id);
}

/**
 * ✅ PATCH /api/foodtype/:id
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await FoodTypeController.softDeleteFoodType(req, id);
}