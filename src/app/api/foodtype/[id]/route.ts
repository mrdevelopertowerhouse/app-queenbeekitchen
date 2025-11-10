import { NextRequest, NextResponse } from "next/server";
import FoodTypeService from "@/server/services/FoodService";

function jsonResponse({
    statusCode = 1,
    message = "",
    data,
}: {
    statusCode?: number;
    message?: string;
    data?: any;
}) {
    return { statusCode, message, data: data ?? null };
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
    return {
        statusCode: 0,
        message,
        error: err.message || String(error),
    };
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await here
        const foodTypeId = Number(id);

        if (!id || isNaN(foodTypeId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const foodType = await FoodTypeService.getFoodTypeById(foodTypeId);
        if (!foodType) {
            return NextResponse.json(
                { statusCode: 0, message: "Food type not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            jsonResponse({
                message: "Food type fetched successfully",
                data: foodType,
            }),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to fetch food type" }),
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await here too
        const foodTypeId = Number(id);

        if (!id || isNaN(foodTypeId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                errorResponse({
                    error: new Error("Name is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        const updaterId = 1;
        const updatedFoodType = await FoodTypeService.updateFoodType(
            foodTypeId,
            { name, description },
            updaterId
        );

        return NextResponse.json(
            jsonResponse({
                message: "Food type updated successfully",
                data: updatedFoodType,
            }),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to update food type" }),
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ await here too
        const foodTypeId = Number(id);

        if (!id || isNaN(foodTypeId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

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

        await FoodTypeService.softDeleteFoodType(foodTypeId, body.delFlag, 1);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to soft delete food type" }),
            { status: 500 }
        );
    }
}
