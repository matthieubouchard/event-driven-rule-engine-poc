import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  // Clean the database
  await prisma.user.deleteMany();

  // Create seed data
  const users = [
    {
      email: "alice@example.com",
      name: "Alice Johnson",
    },
    {
      email: "bob@example.com",
      name: "Bob Smith",
    },
  ];

  console.log(`Start seeding ...`);

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${createdUser.id}`);
  }

  console.log(`Seeding finished.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
