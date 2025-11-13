import { NextRequest, NextResponse } from "next/server";
import { LanguageRequestValidator } from "../validators/language.validator";
import LanguageService from "../services/LanguageService";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";
import { RequestValidator } from "../validators/validators";
import { LanguageUpdateDTO } from "@/shared/dto/language.dto";
import { SoftDeleteUpdateDTO } from "@/shared/dto/common.dto";

export class LanguageController {

    static async createLanguage(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json();

            // ✅ Validate the body after parsing
            LanguageRequestValidator.createLanguage(body);

            const language = await LanguageService.createLanguage(body, 1);

            // ✅ Return only selected fields
            const responseData = {
                id: language.id,
                name: language.name,
                isoCode: language.isoCode,
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
        }
    }


    static async getAllLanguages() {
        try {
            const languages = await LanguageService.getAllLanguages();

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: languages && languages.length > 0 ? 1 : 0,
                    message: languages && languages.length > 0 ? "Languages fetched successfully" : "No languages found",
                    data: languages,
                }),
                { status: 200 }
            );
        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to fetch languages",
            }), { status: 500 });
        }
    }


    static async getLanguageById(id: string) {
        try {
            const languageId = RequestValidator.validateNumericParam(id);

            const language = await LanguageService.getLanguageById(languageId);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: language ? 1 : 0,
                message: language ? "Language fetched successfully" : " Language not found",
                data: language,
            }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status })
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to fetch language",
            }), { status: 500 });
        }
    }


    static async updateLanguage(req: NextRequest, id: string) {

        try {
            const languageId = RequestValidator.validateNumericParam(id);

            // Parse the request body to get delFlag
            const body = await req.json() as LanguageUpdateDTO;

            //Use the correct validator
            LanguageRequestValidator.updateLanguage(body);

            const language = await LanguageService.updateLanguage(languageId, body, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: language ? 1 : 0,
                message: language ? "Language updated successfully" : "Failed to update language",
                data: language,
            }), { status: 200 });

        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to update language",
            }), { status: 500 })

        }
    }

    static async softDeleteLanguage(req: NextRequest, id: string) {
        try {

            const languageId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as SoftDeleteUpdateDTO;

            RequestValidator.validateSoftDelete(body);

            const deleted = await LanguageService.softDeleteLanguage(languageId, body.delFlag, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: deleted ? 1 : 0,
                message: deleted ? "Language deleted successfully" : "Language not found",
            }), { status: 200 });


        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Language not deleted",
            }), { status: 500 })
        }
    }



}
