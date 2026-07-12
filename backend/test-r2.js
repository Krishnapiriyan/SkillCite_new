import 'dotenv/config';
import { uploadToR2 } from './src/utils/r2.util.js';

async function test() {
  try {
    const dummyBuffer = Buffer.from('Hello R2 Test!');
    const url = await uploadToR2(dummyBuffer, 'test-file.txt', 'text/plain');
    console.log('SUCCESS! File uploaded to:', url);
  } catch (error) {
    console.error('FAILED!', error);
  }
}
test();
