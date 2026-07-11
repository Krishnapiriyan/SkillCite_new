import prisma from '../../config/database.js';

export const saveEngineeringRequest = async (body, uploadedFiles) => {
  return prisma.engineeringRequest.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      company: body.company || null,
      serviceType: body.serviceType,
      description: body.description,
      deadline: new Date(body.deadline),
      budget: body.budget || null,
      files: {
        create: uploadedFiles.map(f => ({
          r2Key: f.key,
          publicUrl: f.url,
          originalName: f.name,
          mimeType: f.mimeType,
          sizeBytes: f.size,
        }))
      }
    },
    include: { files: true }
  });
};

export const getEngineeringRequests = async (skip = 0, take = 20) => {
  const [items, total] = await Promise.all([
    prisma.engineeringRequest.findMany({
      skip,
      take,
      orderBy: { submittedAt: 'desc' },
      include: { files: true }
    }),
    prisma.engineeringRequest.count()
  ]);
  return { items, total };
};

export const getEngineeringRequestById = async (id) => {
  const req = await prisma.engineeringRequest.findUnique({
    where: { id },
    include: { files: true }
  });
  return req;
};

export const markEngineeringRead = async (id, isRead) => {
  return prisma.engineeringRequest.update({
    where: { id },
    data: { isRead }
  });
};
