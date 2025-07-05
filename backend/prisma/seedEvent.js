// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Temporary mock data for events
  await prisma.event.createMany({
    data: [
      {
        name: 'Summer Festival',
        isPublic: true,
        description: 'A fun summer festival with music and food.',
        location: 'Seoul Plaza',
        startAt: new Date('2025-08-15T10:00:00Z'),
        endAt: new Date('2025-08-15T18:00:00Z'),
        contactName: 'Kim Minsoo',
        contactPhone: '010-1234-5678',
        bannerImageUrl: 'https://example.com/images/summer.jpg',
      },
      {
        name: 'Tech Conference 2025',
        isPublic: false,
        description: 'Annual tech conference for developers.',
        location: 'COEX Convention Center',
        startAt: new Date('2025-09-01T09:00:00Z'),
        endAt: new Date('2025-09-03T17:00:00Z'),
        contactName: 'Lee Jiwon',
        contactPhone: '010-8765-4321',
        bannerImageUrl: 'https://example.com/images/tech.jpg',
      },
      {
        name: 'Charity Marathon',
        isPublic: true,
        location: 'Han River Park',
        startAt: new Date('2025-10-10T07:00:00Z'),
        endAt: new Date('2025-10-10T12:00:00Z'),
        contactName: 'Park Hyunwoo',
        contactPhone: '010-5555-1111',
      },
    ],
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
