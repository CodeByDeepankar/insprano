import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@insprano.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'securepassword123'
  
  // Basic bcrypt hash (we can use bcryptjs if next-auth bcrypt isn't working on edge)
  // Since we run this in node, bcrypt is fine. Actually, next-auth uses bcrypt or bcryptjs.
  // Wait, I will install bcryptjs since it's easier to use across environments without python/node-gyp issues.
  
  const hashedPassword = await hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
    },
  })
  
  console.log('Seeded Admin:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
