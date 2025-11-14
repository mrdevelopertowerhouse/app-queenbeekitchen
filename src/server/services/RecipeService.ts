import prisma from "@/prisma/client";
import { RecipeCreateDTO } from "@/shared/dto/recipe.dto";
import { m_recipe, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { AppPrismaError } from "../errors/AppPrismaError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import { CuisineUniqueConstraints, RecipeUniqueConstraints } from "../prisma/UniqueConstraints";


export class RecipeService {

    static async createRecipe(data: RecipeCreateDTO, creatorId: number): Promise<Partial<m_recipe>> {
        try {
            const savedRecipe = await prisma.m_recipe.create({
                data: {
                    uuid: data.uuid,
                    cuisineId: data.cuisineId,
                    categoryId: data.categoryId,
                    foodTypeId: data.foodTypeId,
                    regionalName: data.title_name,  // mapping happens here
                    imageUrl: data.imageUrl ?? null,
                    videoUrl: data.videoUrl ?? null,
                    createdBy: creatorId,
                    updatedBy: creatorId
                },
                select: {
                    id: true,
                    regionalName: true
                }
            });

            return savedRecipe;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_recipe, RecipeUniqueConstraints>(error, {
                    fk: ['createdBy', 'updatedBy'],
                    unique: [
                        {
                            field: 'uuid',
                            message: `Recipe with recipeid'${data.uuid}' already exists.`
                        },
                        {
                            field: 'regionalName',
                            message: `Recipe with regional name'${data.title_name} already exists`
                        }
                    ],
                });
            }
            throw error; // Re-throw to handle in controller

        }
    }
}