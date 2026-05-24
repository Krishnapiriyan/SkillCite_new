import prisma from '../../config/database.js';

export const saveContactMessage = async (body) => {
  return prisma.contactMessage.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      enquiryType: body.enquiryType,
      message: body.message
    }
  });
};

export const getContactMessages = async (skip = 0, take = 20) => {
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      skip,
      take,
      orderBy: { submittedAt: 'desc' }
    }),
    prisma.contactMessage.count()
  ]);
  return { items, total };
};

export const getContactMessageById = async (id) => {
  return prisma.contactMessage.findUnique({
    where: { id }
  });
};
