import { S3Client } from '@aws-sdk/client-s3';
import env from './env.js';

const isR2Configured = 
  env.R2_ACCOUNT_ID && !env.R2_ACCOUNT_ID.includes('your-') &&
  env.R2_ACCESS_KEY_ID && !env.R2_ACCESS_KEY_ID.includes('your-') &&
  env.R2_SECRET_ACCESS_KEY && !env.R2_SECRET_ACCESS_KEY.includes('your-') &&
  env.R2_BUCKET_NAME && !env.R2_BUCKET_NAME.includes('your-');

export const r2Client = isR2Configured 
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

export { isR2Configured };
