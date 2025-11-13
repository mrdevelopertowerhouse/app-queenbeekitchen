import { NextRequest, NextResponse } from "next/server";
import CategoryService from "@/server/services/CategoryService";
import { CategoryController } from "@/server/controllers/CategoryController";

/**
 * ✅ GET /api/category/:id
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await CategoryController.getCategoryById(id);
}

/**
 * ✅ PUT /api/categories/:id
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await CategoryController.updateCategory(req, id);
}

/**
 * ✅ PATCH /api/categories/:id
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await CategoryController.softDeleteCategory(req, id);
}


