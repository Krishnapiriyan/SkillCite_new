import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, isR2Configured } from '../config/r2.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import env from '../config/env.js';
import { getPublicApiOrigin } from './publicUrl.util.js';

const MOCK_DIR = path.resolve('public/mock-uploads');

export const uploadToR2 = async (buffer, originalName, mimeType) => {
  const ext = path.extname(originalName);
  const key = `uploads/${uuidv4()}${ext}`;

  // Check if the public URL is mistakenly configured as the private API gateway
  const isPrivateGateway = env.R2_PUBLIC_URL && env.R2_PUBLIC_URL.includes('r2.cloudflarestorage.com');

  if (isR2Configured && r2Client && !isPrivateGateway) {
    await r2Client.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }));

    return {
      key,
      url: `${env.R2_PUBLIC_URL}/${key}`,
      name: originalName,
      mimeType,
      size: buffer.length,
    };
  } else {
    // Local mock upload (used when R2 is unconfigured or misconfigured as private gateway)
    if (!fs.existsSync(MOCK_DIR)) {
      fs.mkdirSync(MOCK_DIR, { recursive: true });
    }
    const localPath = path.join(MOCK_DIR, path.basename(key));
    fs.writeFileSync(localPath, buffer);

    const url = `${getPublicApiOrigin()}/mock-uploads/${path.basename(key)}`;

    console.log(`[R2 MOCK UPLOAD] Saved ${originalName} → ${url}`);

    // Backup to R2 in background — do not block the HTTP response (large videos were timing out)
    if (isR2Configured && r2Client && isPrivateGateway) {
      r2Client
        .send(
          new PutObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
          })
        )
        .then(() => console.log(`[R2 BACKUP SUCCESS] ${originalName}`))
        .catch((err) => console.error(`[R2 BACKUP ERROR] ${originalName}:`, err.message));
    }

    return {
      key,
      url,
      name: originalName,
      mimeType,
      size: buffer.length,
    };
  }
};

export const deleteFromR2 = async (key) => {
  if (isR2Configured && r2Client) {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }));
  } else {
    const filename = path.basename(key);
    const localPath = path.join(MOCK_DIR, filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    console.log(`[R2 MOCK DELETE] Deleted ${filename} from local mock-uploads`);
  }
};
