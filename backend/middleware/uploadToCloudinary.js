import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'userImages',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const uploadImages = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max. 5 MB
}).fields([
  { name: 'titleImage', maxCount: 1 },
  { name: 'otherImages', maxCount: 4 },
]);

async function uploadMW(req, res, next) {
  uploadImages(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'One or more images too big. Max. file size: 5 MB.',
        });
      }
      return res.status(400).json({ message: 'Error uploading images.' });
    }
    const method = req.method;
    if (method === 'POST') {
      if (!req.files['titleImage']) {
        return res.status(400).json({ message: 'Title image is required.' });
      }
    }
    if (req.files['otherImages'] && req.files['otherImages'].length > 4) {
      return res.status(400).json({
        message: 'Maximum number of other images exceeded (4 images allowed).',
      });
    }

    next();
  });
}

export default uploadMW;
