const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.findUnique({
    where: { email: 'prayogiputraaji@gmail.com' }
  });
  console.log('User:', user);
  
  if (user) {
    const responses = await prisma.responses.findMany({
      where: { user_id: user.id }
    });
    console.log('Responses:', responses);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
