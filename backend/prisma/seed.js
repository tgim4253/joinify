import {PrismaClient, Role} from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

// 어드민 계정이 없을 경우 초기화
async function main() {
    const exists = await prisma.user.findFirst();
    if (exists) return;

    const passwordHash = await bcrypt.hash(process.env.password, 10);
    await prisma.user.create({
        data: {
            email: process.env.email,
            passwordHash,
            role: Role.admin,
        },
    });

    console.log("Admin user created");
}

// 비동기함수(main)을 호출 후 결과에 상관없이 prisma와 연결 종료
main().finally(()=>{
    prisma.$disconnect()
});
