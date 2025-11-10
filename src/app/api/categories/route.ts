import { NextRequest, NextResponse } from "next/server";
import CategoryService from "@/server/services/CategoryService"

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
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ✅ Validation
        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json(
                errorResponse({
                    error: new Error("Name is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        // ✅ Create the category
        const category = await CategoryService.createCategory(
            {
                name: body.name,
                description: body.description || null,
            },
            1 // creatorId (replace with actual userId if available)
        );

        const responseData = {
            id: category.id,
            name: category.name,
            description: category.description,
        };

        return NextResponse.json(
            jsonResponse({
                message: "Category created successfully",
                data: responseData,
            }),
            { status: 201 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to create category" }),
            { status: 500 }
        );
    }
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