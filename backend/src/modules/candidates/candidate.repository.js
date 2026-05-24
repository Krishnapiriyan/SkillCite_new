import prisma from '../../config/database.js';

export const saveCandidateSubmission = async (body, uploadedResume, uploadedCoverLetter) => {
  const filesToCreate = [];
  if (uploadedResume) {
    filesToCreate.push({
      r2Key: uploadedResume.key,
      publicUrl: uploadedResume.url,
      originalName: uploadedResume.name,
      mimeType: uploadedResume.mimeType,
      sizeBytes: uploadedResume.size,
    });
  }
  if (uploadedCoverLetter) {
    filesToCreate.push({
      r2Key: uploadedCoverLetter.key,
      publicUrl: uploadedCoverLetter.url,
      originalName: uploadedCoverLetter.name,
      mimeType: uploadedCoverLetter.mimeType,
      sizeBytes: uploadedCoverLetter.size,
    });
  }

  const filesRelation = filesToCreate.length > 0 ? { create: filesToCreate } : undefined;

  return prisma.candidateSubmission.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      location: body.location || "",
      nationality: body.nationality || null,
      rightToWork: body.rightToWork || "",
      specialty: body.specialty || "",
      preferredRole: body.preferredRole || "",
      skills: body.skills || [],
      experienceLevel: body.experienceLevel || "",
      yearsExperience: body.yearsExperience || 0,
      employmentStatus: body.employmentStatus || "",
      linkedIn: body.linkedIn || null,
      portfolio: body.portfolio || null,
      github: body.github || null,
      coverNote: body.coverNote || null,
      files: filesRelation,

      // New u&u fields
      coverLetterUrl: uploadedCoverLetter ? uploadedCoverLetter.url : null,
      state: body.state || null,
      careerExperience: body.careerExperience || null,
      careerGoals: body.careerGoals || [],
      reasonableAdjustments: body.reasonableAdjustments || null,
      reasonableAdjustmentsDetails: body.reasonableAdjustmentsDetails || null,
      preferredCommunication: body.preferredCommunication || null,
    },
    include: { files: true }
  });
};

export const getCandidateSubmissions = async (skip = 0, take = 20) => {
  const [items, total] = await Promise.all([
    prisma.candidateSubmission.findMany({
      skip,
      take,
      orderBy: { submittedAt: 'desc' },
      include: { files: true }
    }),
    prisma.candidateSubmission.count()
  ]);
  return { items, total };
};

export const getCandidateSubmissionById = async (id) => {
  return prisma.candidateSubmission.findUnique({
    where: { id },
    include: { files: true }
  });
};
