-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerRequest" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "specialty" TEXT,
    "requiredRole" TEXT,
    "requiredSkills" TEXT[],
    "teamSize" INTEGER,
    "experienceLevel" TEXT,
    "employmentType" TEXT[],
    "projectType" TEXT,
    "description" TEXT,
    "timeline" TEXT,
    "budgetRange" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engagementNeed" TEXT,
    "jobTitle" TEXT,
    "jobLocation" TEXT,
    "jobType" TEXT,
    "contactFirstName" TEXT,
    "contactLastName" TEXT,
    "company" TEXT,
    "state" TEXT,
    "position" TEXT,
    "workEmail" TEXT,

    CONSTRAINT "EmployerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSubmission" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT,
    "nationality" TEXT,
    "rightToWork" TEXT,
    "specialty" TEXT,
    "preferredRole" TEXT,
    "skills" TEXT[],
    "experienceLevel" TEXT,
    "yearsExperience" INTEGER,
    "employmentStatus" TEXT,
    "linkedIn" TEXT,
    "portfolio" TEXT,
    "github" TEXT,
    "coverNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverLetterUrl" TEXT,
    "state" TEXT,
    "careerExperience" TEXT,
    "careerGoals" TEXT[],
    "reasonableAdjustments" TEXT,
    "reasonableAdjustmentsDetails" TEXT,
    "preferredCommunication" TEXT,

    CONSTRAINT "CandidateSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineeringRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "budget" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EngineeringRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enquiryType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerRequestId" TEXT,
    "candidateSubmissionId" TEXT,
    "engineeringRequestId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");

-- CreateIndex
CREATE UNIQUE INDEX "File_r2Key_key" ON "File"("r2Key");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_employerRequestId_fkey" FOREIGN KEY ("employerRequestId") REFERENCES "EmployerRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_candidateSubmissionId_fkey" FOREIGN KEY ("candidateSubmissionId") REFERENCES "CandidateSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_engineeringRequestId_fkey" FOREIGN KEY ("engineeringRequestId") REFERENCES "EngineeringRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
