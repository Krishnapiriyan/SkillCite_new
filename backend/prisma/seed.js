import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Default Admin
  const adminEmail = 'admin@skillcite.com';
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'System Admin',
      }
    });
    console.log(`✅ Admin user seeded! Email: ${admin.email} / Password: password123`);
  } else {
    console.log('ℹ️ Admin user already exists. Skipping...');
  }

  // 2. Create Default CMS Site Content
  const cmsContent = [
    // Homepage
    { key: 'home.hero.title', value: 'Engineering Talent. Delivered Personally.' },
    { key: 'home.hero.subtitle', value: 'SkillCite connects premium engineering talent with leading companies. Our specialist recruitment team handles everything personally.' },
    { key: 'home.marquee.stats', value: '500+ Placements • 98% Retention Rate • 24hr Quick Review • 100% Personal Touch' },
    
    // Process Flow
    { key: 'home.process.step1', value: 'Submit Form: Complete our fast portal forms' },
    { key: 'home.process.step2', value: 'Stored Securely: Stored in high-grade database' },
    { key: 'home.process.step3', value: 'Admin Reviews: Reviewed by real expert recruiter' },
    { key: 'home.process.step4', value: 'Personal Contact: Direct human reach-out via email' },
    { key: 'home.process.step5', value: 'Delivered Offline: Services delivered offline with care' },
    
    // Services Overview
    { key: 'home.services.recruitment.title', value: 'Recruitment & Intake' },
    { key: 'home.services.recruitment.desc', value: 'Bespoke staffing solutions across Engineering, Accounting, and Administrative roles.' },
    { key: 'home.services.engineering.title', value: 'Engineering Consultancy' },
    { key: 'home.services.engineering.desc', value: 'Professional AutoCAD drafting, estimations, structural calculations, and consultation.' },
    
    // About Page
    { key: 'about.title', value: 'About SkillCite' },
    { key: 'about.description', value: 'We are a premier recruitment agency and technical engineering consultancy. Rather than relying on automated matching pipelines, we believe in manual excellence. Every resume, recruitment request, and technical service spec is reviewed by a senior engineer.' },
    
    // Contact details
    { key: 'contact.phone', value: '+1 (555) 019-2834' },
    { key: 'contact.email', value: 'admin@skillcite.com' },
    { key: 'contact.address', value: '100 Pine Street, Suite 2400, San Francisco, CA' },
    { key: 'contact.hours', value: 'Monday - Friday: 9:00 AM - 6:00 PM' },
    
    // Footer
    { key: 'footer.copyright', value: '© 2026 SkillCite. All rights reserved.' },
  ];

  for (const item of cmsContent) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: { key: item.key, value: item.value }
    });
  }

  console.log(`✅ CMS content seeded! (${cmsContent.length} keys populated)`);
  console.log('🌱 Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
