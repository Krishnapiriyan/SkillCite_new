import prisma from '../../config/database.js';

export const saveEmployerRequest = async (body, uploadedFiles) => {
  return prisma.employerRequest.create({
    data: {
      companyName: body.companyName || body.company || "",
      contactPerson: body.contactPerson || `${body.contactFirstName} ${body.contactLastName}`.trim(),
      email: body.email || body.workEmail || "",
      phone: body.phone,
      location: body.location || body.jobLocation || "",
      website: body.website || null,
      specialty: body.specialty || "",
      requiredRole: body.requiredRole || body.jobTitle || "",
      requiredSkills: body.requiredSkills || [],
      teamSize: body.teamSize || null,
      experienceLevel: body.experienceLevel || "",
      employmentType: body.employmentType || [],
      projectType: body.projectType || null,
      description: body.description || "",
      timeline: body.timeline || "",
      budgetRange: body.budgetRange || null,
      files: {
        create: (uploadedFiles || []).map(f => ({
          r2Key: f.key,
          publicUrl: f.url,
          originalName: f.name,
          mimeType: f.mimeType,
          sizeBytes: f.size,
        }))
      },

      // New u&u fields
      engagementNeed: body.engagementNeed || null,
      jobTitle: body.jobTitle || null,
      jobLocation: body.jobLocation || null,
      jobType: body.jobType || null,
      contactFirstName: body.contactFirstName || null,
      contactLastName: body.contactLastName || null,
      company: body.company || null,
      state: body.state || null,
      position: body.position || null,
      workEmail: body.workEmail || null,
    },
    include: { files: true }
  });
};

export const getEmployerRequests = async (skip = 0, take = 20) => {
  const [items, total] = await Promise.all([
    prisma.employerRequest.findMany({
      skip,
      take,
      orderBy: { submittedAt: 'desc' },
      include: { files: true }
    }),
    prisma.employerRequest.count()
  ]);
  return { items, total };
};

export const getEmployerRequestById = async (id) => {
  return prisma.employerRequest.findUnique({
    where: { id },
    include: { files: true }
  });
};
