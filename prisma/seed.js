import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const username = "admin";
    const tempPassword = "changeme123";

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
        console.log(`User "${username}" already exists. Skipping.`);
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const user = await prisma.user.create({
        data: {
            username,
            passwordHash,
            mustChangePassword: true,
        },
    });

    console.log("Created initial admin user:");
    console.log(`  id:                 ${user.id}`);
    console.log(`  username:           ${user.username}`);
    console.log(`  temporary password: ${tempPassword}`);
    console.log(`  mustChangePassword: ${user.mustChangePassword}`);
    console.log("");
    console.log("Log in and call PATCH /users/me/password to set a real password.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
