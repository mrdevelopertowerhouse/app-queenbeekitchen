import { NextRequest, NextResponse } from "next/server";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";

export class CategoryController {

    // static async createCuisine(req: NextRequest) {
    //     try {
    //         // ✅ Parse the request body first
    //         const body = await req.json();

    //         // ✅ Validate the body after parsing
    //         CategoryRequestValidator.createCategory(body);

    //         const cuisine = await CuisineService.createCuisine(body, 1);

    //         // ✅ Return only selected fields
    //         const responseData = {
    //             id: cuisine.id,
    //             name: cuisine.name,
    //             description: cuisine.description,
    //         };

    //         return NextResponse.json(
    //             Controller.jsonResponse({
    //                 statusCode: responseData ? 1 : 0,
    //                 message: responseData ? "Cuisine created successfully" : "Failed to create cuisine",
    //                 data: responseData,
    //             }),
    //             { status: 201 }
    //         );

    //     } catch (error: unknown) {
    //         console.error("🔥 Controller error in createCuisine:", error);

    //         if (error instanceof HttpError) {
    //             return NextResponse.json(error.toJson(), { status: error.status });
    //         }

    //         return NextResponse.json(
    //             Controller.errorResponse({
    //                 error: error,
    //                 message: "Failed to create cuisine",
    //             }),
    //             { status: 500 }
    //         );

    //         //     return NextResponse.json(Controller.errorResponse(      

    //         //         {
    //         //             error:error,
    //         //             message: "Failed to create cuisine",
    //         //         },
    //         //         { status: 500 }
    //         //    );
    //     }
    // }
}