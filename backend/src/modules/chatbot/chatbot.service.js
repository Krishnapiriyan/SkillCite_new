import Groq from 'groq-sdk';
import env from '../../config/env.js';

const isGroqConfigured = env.GROQ_API_KEY && !env.GROQ_API_KEY.includes('your-');

const groq = isGroqConfigured ? new Groq({ apiKey: env.GROQ_API_KEY }) : null;

const SYSTEM_PROMPT = `You are SkillCite's website assistant. SkillCite is an engineering recruitment and services agency.

When greeting or beginning a conversation, always align with this welcome message: "Welcome to SkillCite. If you're an employer looking for talent, please visit our /request-talent page, or if you're a candidate, head to /submit-your-cv to get started."

Platform Overview & Training Context:
- Centralized Platform: SkillCite is a centralized Engineering Recruitment and Engineering Services Management platform designed to collect, manage, and process recruitment and service requests through a modern SaaS-based system.
- Two Portals: A public User Portal and a secure Admin Portal. In the User Portal, employers can request talent, candidates can submit resumes, clients can request engineering services (AutoCAD drawings, estimation, calculations, and consultation), and users can send general inquiries through the contact system.
- Secure Admin Portal: A dashboard where administrators manually manage all submissions in organized list views. Admins manually review submissions, files, and contact details, communicating with users through integrated email. The system intentionally avoids automated workflows, approval pipelines, or status management to keep human decision-making at the center of recruitment and consultancy operations.
- Central Tech Stack: PostgreSQL database, Prisma ORM, Cloudflare R2 file storage, Brevo email services, and Groq API with LLaMA models.

Your ONLY jobs are:
1. Help visitors understand what SkillCite does and its philosophy (human-in-the-loop manual review).
2. Guide them to correct quick links: /request-talent (employers seeking talent), /submit-your-cv (candidates looking for a job), /engineering-services (AutoCAD, cost estimation, Calculations), /contact (general office details).
3. Explain the intake process: submit form -> admin reviews details manually -> direct personal contact.
4. Answer FAQ about divisions (Engineering, Accounting, Administrative) and tech stack if asked.

You CANNOT:
- Access private database records or sensitive admin data
- Make hiring decisions or replace the human admin team
- Discuss anything unrelated to SkillCite

Keep responses under 3 sentences. Always direct users to the relevant page using the exact quick links (/request-talent, /submit-your-cv, /engineering-services, /contact). Be professional, warm, and helpful.`;

export const processChat = async (messages) => {
  if (isGroqConfigured && groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-6), // last 6 messages for context window
        ],
        max_tokens: 200,
        temperature: 0.5,
      });
      return completion.choices[0].message.content;
    } catch (err) {
      console.error('Groq Chatbot Error:', err.message);
      return "Welcome to SkillCite. If you're an employer looking for talent, please visit our /request-talent page, or if you're a candidate, head to /submit-your-cv to get started.";
    }
  } else {
    // Elegant Mock Fallback
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || '';

    let response = "Welcome to SkillCite. If you're an employer looking for talent, please visit our /request-talent page, or if you're a candidate, head to /submit-your-cv to get started.";

    if (lastUserMessage.includes('employer') || lastUserMessage.includes('hire') || lastUserMessage.includes('recru')) {
      response = "If you are looking to hire premium engineering talent, please visit our /request-talent page! Our specialist recruitment team will personally review your specifications and contact you within 24 hours.";
    } else if (lastUserMessage.includes('candidate') || lastUserMessage.includes('cv') || lastUserMessage.includes('job') || lastUserMessage.includes('resume')) {
      response = "Are you a candidate? Head to /submit-your-cv to get started by uploading your resume. Our in-house technical team will contact you directly once matching opportunities are identified.";
    } else if (lastUserMessage.includes('service') || lastUserMessage.includes('autocad') || lastUserMessage.includes('draft') || lastUserMessage.includes('estimat')) {
      response = "We provide premium AutoCAD shop drawings, precision cost estimation take-offs, and engineering calculations. Please submit your specifications directly on our /engineering-services page.";
    } else if (lastUserMessage.includes('contact') || lastUserMessage.includes('email') || lastUserMessage.includes('phone')) {
      response = "For general questions, office address details, or hours, please head to /contact or email our support desk at admin@skillcite.com.";
    } else {
      response = "Welcome to SkillCite. If you're an employer looking for talent, please visit our /request-talent page, or if you're a candidate, head to /submit-your-cv to get started.";
    }

    return response;
  }
};
