import multer from 'multer';
import path from 'path';

// Configure disk storage for Multer. Uploads will be saved temporarily in 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

/**
 * Filter file uploads to restrict them to PDF only.
 * Validates both MIME type and file extension.
 *
 * @param {object} req - Express request object.
 * @param {object} file - Express file object.
 * @param {function} cb - Multer callback.
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file type. Only PDF files (.pdf) are allowed.'));
  }
};

/**
 * Multer middleware instance configured with storage, file type filtering, and size limit (10MB).
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum file size
  }
});

export default upload;
