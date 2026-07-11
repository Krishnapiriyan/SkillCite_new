import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.employerRequest.updateMany({ data: { isRead: true } });
  await prisma.candidateSubmission.updateMany({ data: { isRead: true } });
  await prisma.engineeringRequest.updateMany({ data: { isRead: true } });
  await prisma.contactMessage.updateMany({ data: { isRead: true } });
  console.log("All existing records marked as read.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
