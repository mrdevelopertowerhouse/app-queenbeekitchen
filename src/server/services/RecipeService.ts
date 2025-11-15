import prisma from "@/prisma/client";
import { RecipeCreateDTO, RecipeUpdateDTO } from "@/shared/dto/recipe.dto";
import { m_recipe, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { AppPrismaError } from "../errors/AppPrismaError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import { RecipeUniqueConstraints } from "../prisma/UniqueConstraints";
import { NotFoundError } from "../errors/NotFoundError";

enum ErrorCode {
    CUISINE_NOT_FOUND = "CUISINE_NOT_FOUND",
    CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUIND",
    FOODTYPE_NOT_FOUND = "FOODTYPE_NOT_FOUND",
    RECIPE_NOT_FOUND = "RECIPE_NOT_FOUND"
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

        /**
         * 
         * Get a recipe by its ID
         * @param id Recipe ID 
         * @returns  Promise<Partial<m_recipe>> - recipe object with only selected fields
         * 
         * @throws NotFoundError if recipe with given ID does not exist
         */
        static async getRecipeById(id: number) {
    
            const recipe = await prisma.m_recipe.findUnique({
                where: { id, delFlag: false },
                select: { id: true, titleName:true },
            });
    
            // Guard: if cuisine not found, throw error
            if (!recipe) throw new NotFoundError(ErrorCode.CUISINE_NOT_FOUND);
    
            return {
                id: recipe.id,
                titleName: recipe.titleName
            };
        }

            /**
             * 
             * Update a recipe by its ID
             * 
             * @param id Recipe ID
             * @param data  RecipeUpdateDTO containing updated recipe details
             * @param updaterId  ID of the user performing the update
             * @returns  Promise<Partial<m_recipe>> - updated recipe object with only selected fields
             * 
             * @throws NotFoundError if recipe with given ID does not exist
             * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations
             */
            static async updateRecipe(id: number, data: RecipeUpdateDTO, updaterId: number) {
                try {
                    const updatedRecipe = await prisma.m_recipe.update({
                        where: { id },
                        data: {
                            cuisineId: data.cuisineId,
                            categoryId: data.categoryId,
                            foodTypeId: data.foodTypeId,
                            titleName: data.titleName,
                            imageUrl: data.imageUrl ?? undefined,
                            videoUrl: data.videoUrl ?? undefined,
                            updatedBy: updaterId,
                        },
                        select: {
                            id: true,
                            uuid: true,
                            titleName: true,
                            cuisineId: true,
                            categoryId: true,
                            foodTypeId: true,
                            imageUrl: true,
                            videoUrl: true,
                            updatedAt: true,
                        },
                    });

                    return updatedRecipe;

                } catch (error) {

                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        AppPrismaError.handle<m_recipe, RecipeUniqueConstraints>(error, {
                            fk: ['cuisineId', 'categoryId', 'foodTypeId', 'updatedBy'],
                            unique: [
                                {
                                    field: "titleName",
                                    message: `Recipe with title '${data.titleName}' already exists.`,
                                }
                            ],
                            notFound: { errorCode: "RECIPE_NOT_FOUND" }
                        });
                    }

                    throw error;
                }
            }


                /**
                 * 
                 * Soft delete a recipe by setting its delFlag
                 * 
                 * @param id Recipe ID
                 * @param delFlag   Boolean flag to indicate soft deletion
                 * @param updaterId  ID of the user performing the deletion
                 * @returns  Promise<m_recipe> - the soft-deleted recipe object
                 * 
                 * @throws NotFoundError if recipe with given ID does not exist
                 */
                static async softDeleteRecipe(id: number, delFlag: boolean, updaterId: number) {
            
                    try {
                        const recipe = await prisma.m_recipe.update({
                            where: { id },
                            data: {
                                delFlag,
                                updatedBy: updaterId,
                            }
                        });
            
                        return recipe;
            
                    } catch (error) {
            
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                            AppPrismaError.handle<m_recipe, RecipeUniqueConstraints>(error, {
                                fk: ['updatedBy'],
                                notFound: { errorCode: ErrorCode.RECIPE_NOT_FOUND }
                            });
                        }
            
                        throw error;
                    }
                }


}
