import { NextRequest, NextResponse } from "next/server";
import CategoryService from "@/services/CategoryService";

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
 * ✅ GET /api/category/:id
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await the params
        const categoryId = Number(id);

        if (isNaN(categoryId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const category = await CategoryService.getCategoryById(categoryId);
        if (!category) {
            return NextResponse.json(
                { statusCode: 0, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                statusCode: 1,
                message: "Category fetched successfully",
                data: category,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to fetch Category" }),
            { status: 500 }
        );
    }
}


/**
 * ✅ PUT /api/categories/:id
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await here
        const categoryId = Number(id);

        if (isNaN(categoryId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const body = await req.json();
        if (!body.name) {
            return NextResponse.json(
                errorResponse({
                    error: new Error("Name is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        const updatedCategory = await CategoryService.updatedCategory(
            categoryId,
            body,
            1
        );

        return NextResponse.json(
            jsonResponse({
                message: "Category updated successfully",
                data: {
                    id: updatedCategory.id,
                    name: updatedCategory.name,
                    description: updatedCategory.description,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to update category" }),
            { status: 500 }
        );
    }
}


/**
 * ✅ PATCH /api/categories/:id
 */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ Await the params Promise
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        // ✅ Validate ID
        if (!idParam || isNaN(id)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        // ✅ Parse and validate request body
        const body = await req.json();
        if (typeof body.delFlag !== "boolean") {
            return NextResponse.json(
                errorResponse({
                    error: new Error("delFlag must be a boolean"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        // ✅ Perform soft delete
        await CategoryService.softDeleteCategory(id, body.delFlag, 1);

        // ✅ Return 204 No Content
        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        const err = error as Error;
        const status = err.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
            errorResponse({ error, message: err.message }),
            { status }
        );
    }
}

