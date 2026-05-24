import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Querying SiteContent table...');
  const contents = await prisma.siteContent.findMany();
  console.log('--- SITE CONTENT RECORDS ---');
  contents.forEach(record => {
    console.log(`[${record.key}]: "${record.value}"`);
  });
  console.log('----------------------------');
}

main()
  .catch(err => {
    console.error('Error querying database:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
