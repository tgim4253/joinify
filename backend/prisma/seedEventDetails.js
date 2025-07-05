// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Temporary mock data for events
  await prisma.member.createMany({
    data: [
      {
        eventId: 1,
        data: {
            "number": 20,
            "name": "ssd"
        },
      },
    ],
  })
  await prisma.eventField.createMany({
    data: [{
        eventId: 1,
        fieldKey: "number2",
        displayName: "number",
        dataType: "number",
        order: 10,
        isSensitive: false,
        isPublic: true,
        }
    ]
  })
}

main()
  .then(() => {
    console.log('✅ Seeding completed.')
  })
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
