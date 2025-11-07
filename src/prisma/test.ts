// src/prisma/test.ts
import { prisma } from "./client";

async function main() {
    const cuisines = await prisma.m_cuisine.findMany();
    console.log("✅ DB connection successful. Total cuisines:", cuisines.length);
}

main()
    .catch(e => console.error("❌ Prisma test error:", e))
    .finally(async () => await prisma.$disconnect());
