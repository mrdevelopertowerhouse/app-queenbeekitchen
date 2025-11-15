import prisma from "@/prisma/client";
import { RecipeCreateDTO } from "@/shared/dto/recipe.dto";
import { m_recipe, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { AppPrismaError } from "../errors/AppPrismaError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import { RecipeUniqueConstraints } from "../prisma/UniqueConstraints";

enum ErrorCode {
    CUISINE_NOT_FOUND = "CUISINE_NOT_FOUND",
    CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUIND",
    FOODTYPE_NOT_FOUND = "FOODTYPE_NOT_FOUND"
}
export class RecipeService {

    static async createRecipe(data: RecipeCreateDTO, creatorId: number): Promise<Partial<m_recipe>> {
        try {
            const savedRecipe = await prisma.m_recipe.create({
                data: {
                    uuid: data.uuid,
                    cuisineId: data.cuisineId,
                    categoryId: data.categoryId,
                    foodTypeId: data.foodTypeId,
                    titleName: data.titleName,  // mapping happens here
                    imageUrl: data.imageUrl ?? null,
                    videoUrl: data.videoUrl ?? null,
                    createdBy: creatorId,
                    updatedBy: creatorId
                },
                select: {
                    id: true,
                    titleName: true
                }
            });

            return savedRecipe;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_recipe, RecipeUniqueConstraints>(error, {
                    fk: ["cuisineId", "categoryId", "foodTypeId", 'createdBy', 'updatedBy'],
                    unique: [
                        {
                            field: 'uuid',
                            message: `Recipe with recipeid'${data.uuid}' already exists.`
                        },
                        {
                            field: 'titleName',
                            message: `Recipe with regional name'${data.titleName} already exists`
                        }
                    ],
                    notFound: { errorCode: ErrorCode.CATEGORY_NOT_FOUND }
                });
            }
            throw error; // Re-throw to handle in controller
        }
    }

    /**
     * 
     * Get all recipes that are not soft-deleted
     * 
     * @returns Promise<Partial<m_recipe>[]> - array of recipe objects with only selected fields
     */
    static async getAllRecipes(): Promise<Partial<m_recipe>[]> {
        const recipes = await prisma.m_recipe.findMany({
            where: {
                delFlag: false,
            },
            select: {
                id: true,
                titleName: true
            },
            orderBy: {
                id: "asc",
            },
        });

        return recipes;
    }

}
