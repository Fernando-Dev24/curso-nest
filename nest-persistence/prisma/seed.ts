import { prisma } from '../src/lib/prisma.js';

export async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  await Promise.all([
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
        tasks: {
          create: [
            { title: 'Task 1' },
            { title: 'Task 2' },
            { title: 'Task 3' },
          ],
        },
      },
    }),

    await prisma.user.create({
      data: {
        name: 'Fernando',
        email: 'fernando@example.com',
        tasks: {
          create: [{ title: 'Task 1' }, { title: 'Task 2' }],
        },
      },
    }),
  ]);
}

main()
  .catch((error) => {
    console.error(`❌ Error al ejecutar el seed: ${error}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('👋 Finalizando seed...');
    await prisma.$disconnect();
  });
