import prisma, { Prisma } from "@/prisma/client";
import { CategoryCreateDTO, CategoryUpdateDTO } from "@/shared/dto/category.dto";
import { AppPrismaError } from "../errors/AppPrismaError";
import { m_category } from "@prisma/client";
import { CuisineUniqueConstraints } from "@/shared/types/CuisineUniqueConstraints";
import { CategoryUniqueConstraints } from "@/shared/types/CategoryUniqueConstraints";
import { NotFoundError } from "../errors/NotFoundError";


enum ErrorCode {
    CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND"
}

class CategoryService {
    /**
     * 
     * Create a new category 
     * 
     * - Handles unique constraint violations for category name  
     * 
     * @param data CreateCategoryDTO containing category details
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations 
     * @returns Partial<m_category> - an object object with only selected fields
     * 
     * @throws HttpError - to be handled by the caller (controller/middleware) for proper HTTP response mapping
     */
    static async createCategory(data: CategoryCreateDTO, creatorId: number): Promise<Partial<m_category>> {
        try {
            const savedCategory = await prisma.m_category.create({
                data: {
                    name: data.name,
                    description: data.description,
                    createdBy: creatorId,
                    updatedBy: creatorId
                },
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            });
            return savedCategory;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_category, CategoryUniqueConstraints>(error, {
                    unique: [
                        {
                            field: 'name',
                            message: `Category with name '${data.name}' already exists.`,
                        },
                    ],
                });
            }
            throw error; // Re-throw to handle in controller
        }
    }


    /**
    * 
    * Get all categories that are not soft-deleted
    * 
    * @returns Promise<Partial<m_category>[]> - array of category objects with only selected fields
    */
    static async getAllCategories() {
        const categories = await prisma.m_category.findMany({
            where: {
                delFlag: false,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        return categories;
    }


    /**
    * 
    * Get a category by its ID
    * @param id Category ID 
    * @returns  Promise<Partial<m_category>> - category object with only selected fields
    * 
    * @throws NotFoundError if category with given ID does not exist
    */
    static async getCategoryById(id: number) {

        const category = await prisma.m_category.findUnique({
            where: { id, delFlag: false },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        // Guard: if category not found, throw error
        if (!category) throw new NotFoundError(ErrorCode.CATEGORY_NOT_FOUND);

        return {
            id: category.id,
            name: category.name,
            description: category.description,
        };

    }

    /**
     * 
     * Update a category by its ID
     * 
     * @param id Category ID
     * @param data  CategoryUpdateDTO containing updated category details
     * @param updaterId  ID of the user performing the update
     * @returns  Promise<Partial<m_category>> - updated category object with only selected fields
     * 
     * @throws NotFoundError if category with given ID does not exist
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations
     */
    static async updateCategory(id: number, data: CategoryUpdateDTO, updaterId: number) {
        try {

            const updatedCategory = await prisma.m_cuisine.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description?.trim() || null,
                    updatedBy: updaterId,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            });

            if (!updatedCategory) {
                throw new NotFoundError("CATEGORY_NOT_FOUND");
            }

            return updatedCategory;

        } catch (error) {
            console.error("❌ Error while updating category:", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_category, CategoryUniqueConstraints>(error, {
                    unique: [
                        {
                            field: "name",
                            message: `Category with name '${data.name}' already exists.`,
                        },
                    ],
                });
            }

            throw error;
        }
    }

    /**
     * 
     * Soft delete a category by setting its delFlag
     * 
     * @param id Category ID
     * @param delFlag   Boolean flag to indicate soft deletion
     * @param updaterId  ID of the user performing the deletion
     * @returns  Promise<m_category> - the soft-deleted category object
     * 
     * @throws NotFoundError if category with given ID does not exist
     */
    static async softDeleteCategory(id: number, delFlag: boolean, updaterId: number) {

        const category = await prisma.m_category.update({
            where: { id },
            data: {
                delFlag,
                updatedBy: updaterId,
            },
        });

        // Guard: if category not found, throw error
        if (!category) {
            throw new NotFoundError(ErrorCode.CATEGORY_NOT_FOUND);
        }

        return category;
    }
}

export default CategoryService;
