import prisma from "@/prisma/client";

class CategoryService {
    static async createCategory(
        data: { name: string; description?: string },
        creatorId: number
    ) {
        // ✅ Check if category already exists
        const existing = await prisma.m_category.findFirst({
            where: {
                name: data.name,
                delFlag: false,
            },
        });

        if (existing) {
            throw new Error("Category name must be unique");
        }

        return prisma.m_category.create({
            data: {
                name: data.name,
                description: data.description || null,
                createdBy: creatorId,
                updatedBy: creatorId,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
    }


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


    static async getCategoryById(id: number) {
        const category = await prisma.m_category.findUnique({
            where: { id },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        if (!category || category.delFlag) return null;

        return {
            id: category.id,
            name: category.name,
            description: category.description,
        };
    }


    static async updatedCategory(id: number, data: any, updaterId: number) {
        return prisma.m_category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                updatedBy: updaterId,
            },
            select: { id: true, name: true, description: true },
        });
    }


    static async softDeleteCategory(id: number, delFlag: boolean, updaterId: number) {
        // Check first if the record exists and is not already deleted
        const category = await prisma.m_category.findUnique({
            where: { id },
            select: { id: true, delFlag: true },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        if (category.delFlag && delFlag) {
            throw new Error("Category already deleted");
        }

        return prisma.m_category.update({
            where: { id },
            data: {
                delFlag,
                updatedBy: updaterId,
            },
        });
    }
}

export default CategoryService;
