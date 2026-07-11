import Groq from 'groq-sdk';
import env from '../../config/env.js';

const isGroqConfigured = env.GROQ_API_KEY && !env.GROQ_API_KEY.includes('your-');

const groq = isGroqConfigured ? new Groq({ apiKey: env.GROQ_API_KEY }) : null;

const SYSTEM_PROMPT = `You are SkillCite's website assistant. SkillCite is an engineering recruitment and services agency.

When greeting or beginning a conversation, always align with this welcome message: "Welcome to SkillCite. If you're an employer looking for talent, please visit our /request-talent page, or if you're a candidate, head to /submit-your-cv to get started."

SkillCite Overview & Services:
- Specialized Fields: SkillCite provides recruitment services in three divisions: Engineering (AutoCAD, BIM/CAD draftspersons, structural estimators), Accounting (bookkeeping, technical corporate accounting), and Administrative (business support staff).
- Engineering Services: Offers professional AutoCAD shop drawings, cost estimation, structural compliance calculations, and technical engineering consultation.
- Human-in-the-Loop Philosophy: All submissions, specifications, and resumes are reviewed manually by expert human recruitment and engineering teams. We reject automated matching scripts to maintain high quality.

Your ONLY jobs are:
1. Help visitors understand what SkillCite does and its philosophy (human-in-the-loop manual review).
2. Guide them to correct quick links: /request-talent (employers seeking talent), /submit-your-cv (candidates looking for a job), /engineering-services (AutoCAD, cost estimation, Calculations), /contact (general office details).
3. Explain the intake process: submit form -> admin reviews details manually -> direct personal contact.
4. Answer questions about SkillCite's business divisions (Engineering, Accounting, Administrative).

You CANNOT:
- Discuss the website's code, implementation details, technical stack (such as databases, hosting, coding frameworks, or APIs), or programming architecture.
- Access private database records or sensitive admin data.
- Make hiring decisions or replace the human admin team.
- Discuss anything unrelated to SkillCite's services.

Handling Out-of-Scope or Restricted Questions:
- If a user's question is beyond your system boundaries, unrelated to SkillCite, or violates the restrictions (such as asking about database setups, tech stacks, code, server operations, or off-topic subjects), you MUST respond with:
  "This question is not under our system guidelines. You can ask me about SkillCite's recruitment services, engineering divisions, or how the hiring process works."
- Do not attempt to explain, answer, or elaborate on the out-of-scope topic. Simply output the exact response above, and do NOT append the welcome message or any other text.

Keep responses under 3 sentences. Always direct users to the relevant page using the exact quick links (/request-talent, /submit-your-cv, /engineering-services, /contact). Be professional, warm, and helpful.`;

const getMockResponse = (messages) => {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content?.toLowerCase() || '';

  if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi ') || lastUserMessage === 'hi' || lastUserMessage.includes('hey') || lastUserMessage.includes('greetings') || lastUserMessage.includes('welcome')) {
    return "Welcome to SkillCite, your specialist recruitment and engineering services partner! We provide talent placement in Engineering, Accounting, and Administration, alongside drafting services like AutoCAD shop drawings, cost estimation, and structural calculations.\n\nYou can ask me about our recruitment services, specialty divisions, or how the hiring process works! To get started, you can also head directly to /request-talent if you're looking to hire, or /submit-your-cv if you're looking for opportunities.";
  } else if (lastUserMessage.includes('employer') || lastUserMessage.includes('hire') || lastUserMessage.includes('recru')) {
    return "If you are looking to hire premium talent, please visit our /request-talent page! Our specialist recruitment team will personally review your specifications and contact you within 24 hours.";
  } else if (lastUserMessage.includes('candidate') || lastUserMessage.includes('cv') || lastUserMessage.includes('job') || lastUserMessage.includes('resume')) {
    return "Are you a candidate? Head to /submit-your-cv to get started by uploading your resume. Our in-house technical team will contact you directly once matching opportunities are identified.";
  } else if (lastUserMessage.includes('service') || lastUserMessage.includes('autocad') || lastUserMessage.includes('draft') || lastUserMessage.includes('estimat')) {
    return "We provide premium AutoCAD shop drawings, precision cost estimation take-offs, and engineering calculations. Please submit your specifications directly on our /engineering-services page.";
  } else if (lastUserMessage.includes('contact') || lastUserMessage.includes('email') || lastUserMessage.includes('phone')) {
    return "For general questions, office address details, or hours, please head to /contact or email our support desk at admin@skillcite.com.";
  } else {
    return "This question is not under our system guidelines. You can ask me about SkillCite's recruitment services, engineering divisions, or how the hiring process works.";
  }
};

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
      return getMockResponse(messages);
    }
  } else {
    return getMockResponse(messages);
  }
};
