import multer from 'multer';

const ALLOWED_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/dwg',
  'application/dxf',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Supporting up to 100MB for video background uploads
  fileFilter: (req, file, cb) => {
    // Basic extension/mime checks
    const lowerName = file.originalname.toLowerCase();
    const isDwgOrDxf = lowerName.endsWith('.dwg') || lowerName.endsWith('.dxf');
    const isVideo = lowerName.endsWith('.mp4') || lowerName.endsWith('.webm') || lowerName.endsWith('.mov') || lowerName.endsWith('.ogg');
    const isMimeAllowed = ALLOWED_MIMES.includes(file.mimetype);
    
    // Multer sometimes labels DWG/DXF differently, so we check extension fallback
    if (isMimeAllowed || isDwgOrDxf || isVideo) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});
