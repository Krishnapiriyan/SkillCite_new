import app from './app.js';
import env from './config/env.js';

const PORT = env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 SkillCite Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔧 Mode: ${env.NODE_ENV}`);
  console.log(`===================================================`);
});
