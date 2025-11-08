import prisma from "@/prisma/client";

class FoodTypeService {
    // ✅ Create a new food type
    static async createFoodType(
        data: { name: string; description?: string },
        creatorId: number
    ) {
        // Check for duplicate name
        const existing = await prisma.m_food_type.findFirst({
            where: { name: data.name, delFlag: false },
        });

        if (existing) throw new Error("Food type name must be unique");

        return prisma.m_food_type.create({
            data: {
                name: data.name,
                description: data.description || null,
                createdBy: creatorId,
                updatedBy: creatorId,
            },
            select: { id: true, name: true, description: true },
        });
    }

    // ✅ Get all food types
    static async getAllFoodTypes() {
        return prisma.m_food_type.findMany({
            where: { delFlag: false },
            select: { id: true, name: true, description: true },
            orderBy: { id: "asc" },
        });
    }

    // ✅ Get by ID
    static async getFoodTypeById(id: number) {
        const foodType = await prisma.m_food_type.findUnique({
            where: { id },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        if (!foodType || foodType.delFlag) return null;

        return {
            id: foodType.id,
            name: foodType.name,
            description: foodType.description,
        };
    }

    // ✅ Update by ID
    static async updateFoodType(
        id: number,
        data: { name: string; description?: string },
        updaterId: number
    ) {
        // Ensure unique name
        const duplicate = await prisma.m_food_type.findFirst({
            where: {
                name: data.name,
                delFlag: false,
                NOT: { id },
            },
        });

        if (duplicate) throw new Error("Food type name must be unique");

        return prisma.m_food_type.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                updatedBy: updaterId,
            },
            select: { id: true, name: true, description: true },
        });
    }

    // ✅ Soft delete by ID
    static async softDeleteFoodType(id: number, delFlag: boolean, updaterId: number) {
        return prisma.m_food_type.update({
            where: { id },
            data: {
                delFlag,
                updatedBy: updaterId,
            },
        });
    }
}

export default FoodTypeService;
