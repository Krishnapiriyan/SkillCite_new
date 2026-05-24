import prisma from '../../config/database.js';

export const getSiteContentByKey = async (key) => {
  return prisma.siteContent.findUnique({
    where: { key }
  });
};

export const getAllSiteContent = async () => {
  return prisma.siteContent.findMany();
};

export const updateSiteContentByKey = async (key, value) => {
  return prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
};
