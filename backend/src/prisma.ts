import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 종료시 prisma 연결 종료
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;