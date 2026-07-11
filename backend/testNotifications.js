import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function runTest() {
  console.log("--- Starting Notification Test ---");
  
  // 1. Check current unread count
  let countBefore = await prisma.employerRequest.count({ where: { isRead: false } });
  console.log(`Unread Employer Requests before test: ${countBefore}`);

  // 2. Create a dummy request
  const newReq = await prisma.employerRequest.create({
    data: {
      companyName: "Test Notification Corp",
      contactPerson: "Test Admin",
      phone: "12345",
      isRead: false
    }
  });
  console.log(`Created new dummy request: ${newReq.id}`);

  // 3. Check count again
  let countAfterCreate = await prisma.employerRequest.count({ where: { isRead: false } });
  console.log(`Unread Employer Requests after creation: ${countAfterCreate} (Should be +1)`);

  // 4. Simulate Admin viewing the request (this calls the repository logic we added)
  // Let's manually do what the repository does:
  const req = await prisma.employerRequest.findUnique({ where: { id: newReq.id } });
  if (req && !req.isRead) {
    await prisma.employerRequest.update({ where: { id: newReq.id }, data: { isRead: true } });
    console.log(`Admin viewed the request. Marked isRead to true.`);
  }

  // 5. Check count final
  let countFinal = await prisma.employerRequest.count({ where: { isRead: false } });
  console.log(`Unread Employer Requests after viewing: ${countFinal} (Should be back to original)`);

  // Cleanup
  await prisma.employerRequest.delete({ where: { id: newReq.id } });
  console.log("Test finished and cleaned up.");
}

runTest()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
