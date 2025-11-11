import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";
import { RequestValidator } from "../validators/cuisine.validator";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";

export class CuisineController {

    static creatorId = 1;


    static async createCuisine(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json();

            // ✅ Validate the body after parsing
            RequestValidator.createCuisine(body);

            // 👇 This uses the static value 0
            const creatorId = CuisineController.creatorId;

            const cuisine = await CuisineService.createCuisine(body, creatorId);

            // ✅ Return only selected fields
            const responseData = {
                id: cuisine.id,
                name: cuisine.name,
                description: cuisine.description,
            };

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: responseData ? 1 : 0,
                    message: responseData ? "Cuisine created successfully" : "Failed to create cuisine",
                    data: responseData,
                }),
                { status: 201 }
            );

        } catch (error: unknown) {
            console.error("🔥 Controller error in createCuisine:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(
                Controller.errorResponse({
                    error: error,
                    message: "Failed to create cuisine",
                }),
                { status: 500 }
            );

            //     return NextResponse.json(Controller.errorResponse(      

            //         {
            //             error:error,
            //             message: "Failed to create cuisine",
            //         },
            //         { status: 500 }
            //    );
        }
    }

    static async getAllCuisines() {
        try {
            const cuisines = await CuisineService.getAllCuisines();

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: cuisines && cuisines.length > 0 ? 1 : 0,
                    message: cuisines && cuisines.length > 0 ? "Cuisines fetched successfully" : "No cuisines found",
                    data: cuisines,
                }),
                { status: 200 }
            );
        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to fetch cuisines",
            })), { status: 500 };
        }
    }


    static async getCuisineById(req: NextRequest, id: number) {
        try {
            const cuisine = await CuisineService.getCuisineById(id);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: cuisine ? 1 : 0,
                message: cuisine ? "Cuisine fetched successfully" : "Cuisine not found",
                data: cuisine,
            }), { status: 200 })
        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not fetched",
            })), { status: 500 };
        }
    }


    static async updateCuisine(req: NextRequest, id: number) {
        try {
            const updated = await CuisineService.updateCuisine(id, await req.json(), CuisineController.creatorId);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: updated ? 1 : 0,
                message: updated ? "Cuisine updated successfully" : "Cuisine not found",
                data: updated,
            }), { status: 200 });


        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not updated",
            })), { status: 500 };
        }
    }


    static async softDeleteCuisine(id: number, delFlag: boolean) {

        try {
            const deleted = await CuisineService.softDeleteCuisine(id, delFlag, CuisineController.creatorId);
            return NextResponse.json(Controller.jsonResponse({
                statusCode: deleted ? 1 : 0,
                message: deleted ? "Cuisine deleted successfully" : "Cuisine not found",
            }), { status: 204 });

        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not deleted",

            })), { status: 500 };
        }
    }
}

export default CuisineController;