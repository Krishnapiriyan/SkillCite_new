const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function validateVideoFile(file) {
  if (!file) return 'No file selected';
  const sizeMb = file.size / (1024 * 1024);
  if (file.size > MAX_VIDEO_BYTES) {
    return `File is ${sizeMb.toFixed(1)}MB. Maximum size is 100MB. Compress the video or use a shorter clip.`;
  }
  const allowed = ['.mp4', '.webm', '.mov', '.ogg'];
  const name = file.name.toLowerCase();
  if (!allowed.some((ext) => name.endsWith(ext))) {
    return 'Only .mp4, .webm, .mov, or .ogg videos are allowed.';
  }
  return null;
}

export function formatUploadError(err, file) {
  const sizeMb = file ? (file.size / (1024 * 1024)).toFixed(1) : '?';
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return `Upload timed out (${sizeMb}MB file). Use a video under 25MB for faster uploads, or try again on a stable connection.`;
  }
  if (err.response?.status === 413) {
    return `File too large (${sizeMb}MB). Server limit is 100MB.`;
  }
  return err.response?.data?.error || err.message || 'Upload failed';
}
