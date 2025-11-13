import { NextRequest, NextResponse } from "next/server";
import CategoryService from "@/server/services/CategoryService"
import { CategoryController } from "@/server/controllers/CategoryController";

// ✅ Utility functions for success/error responses
function jsonResponse({
    message = "",
    data = null,
}: {
    message?: string;
    data?: any;
}) {
    return { statusCode: 1, message, data };
}

function errorResponse({
    error,
    message = "Something went wrong",
}: {
    error: unknown;
    message?: string;
}) {
    console.error("❌ Error:", error);
    const err = error as Error;
    return { statusCode: 0, message, error: err.message || String(error) };
}

/**
 * ✅ POST /api/categories
 * Create a new Category
 */
// ✅ POST /api/categories
export async function POST(req: NextRequest) {
    return await CategoryController.createCategory(req);
}

/**
 * @route   GET /api/cuisines
 * @desc    Get all cuisines
 * @access  Public
 */
export async function GET() {
    try {
        const categories = await CategoryService.getAllCategories();

        return NextResponse.json(
            jsonResponse({
                message: "Categories fetched successfully",
                data: categories,
            }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to fetch categories",
            }),
            { status: 500 }
        );
    }
}