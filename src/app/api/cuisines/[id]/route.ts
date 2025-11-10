import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";

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
 * ✅ GET /api/cuisines/:id
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await the params
        const cuisineId = Number(id);

        if (isNaN(cuisineId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const cuisine = await CuisineService.getCuisineById(cuisineId);
        if (!cuisine) {
            return NextResponse.json(
                { statusCode: 0, message: "Cuisine not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                statusCode: 1,
                message: "Cuisine fetched successfully",
                data: cuisine,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to fetch cuisine" }),
            { status: 500 }
        );
    }
}


/**
 * ✅ PUT /api/cuisines/:id
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await here
        const cuisineId = Number(id);

        if (isNaN(cuisineId)) {
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

        const updatedCuisine = await CuisineService.updateCuisine(
            cuisineId,
            body,
            1
        );

        return NextResponse.json(
            jsonResponse({
                message: "Cuisine updated successfully",
                data: {
                    id: updatedCuisine.id,
                    name: updatedCuisine.name,
                    description: updatedCuisine.description,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to update cuisine" }),
            { status: 500 }
        );
    }
}



/**
 * ✅ PATCH /api/cuisines/:id
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
        await CuisineService.softDeleteCuisine(id, body.delFlag, 1);

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



