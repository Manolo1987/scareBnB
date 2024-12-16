//uploadCloudinary.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

const storageTitleImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'titleImage',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const storageImages = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const uploadTitleImage = multer({
  storage: storageTitleImage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('titleImage');

const uploadImages = multer({
  storage: storageImages,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).array('images', 4);

function uploadMW(req, res, next) {
  uploadTitleImage(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'Title image too big. Max. file size: 5 MB.',
        });
      }
      return res.status(400).json({ message: 'Error uploading title image.' });
    }

    uploadImages(req, res, (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === 'LIMIT_FILE_SIZE'
        ) {
          return res.status(400).json({
            message: 'One or more images too big. Max. file size: 5 MB.',
          });
        }
        return res.status(400).json({ message: 'Error uploading images.' });
      }

      // req.file enthält das Titelbild
      // req.files enthält die anderen Bilder

      if (!req.file) {
        return res.status(400).json({ message: 'Title image is required.' });
      }

      if (req.files.length > 4) {
        return res.status(400).json({
          message: 'Maximum number of images (4) exceeded.',
        });
      }

      next();
    });
  });
}

module.exports = uploadMW;
