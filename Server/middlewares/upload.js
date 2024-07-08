import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/claudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = '';
    if (file.fieldname === 'profileImageUrl') {
      folderName = 'profileImage';
    } else if (file.fieldname === 'book_image') {
      folderName = 'coverImage';
    }

    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png'],
    };
  },
});

const upload = multer({ storage });

export default upload;