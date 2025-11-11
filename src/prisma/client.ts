// import { PrismaClient } from "@prisma/client";

// // ...existing code...
// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// export const prisma =
//     globalForPrisma.prisma ||
//     new PrismaClient({
//         log: ["query", "error", "warn"],
//     });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



// export default prisma;


import { PrismaClient, Prisma } from "@prisma/client";

// ...existing code...
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
export { Prisma }; // ✅ add this line
