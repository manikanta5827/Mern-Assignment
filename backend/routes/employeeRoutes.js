import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp'; // Import sharp for image compression

const router = express.Router();

// Set up multer storage to save files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Save files in the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

// Define a file filter to allow only image files
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Input file contains unsupported image format'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }); // Use disk storage with file filter

// Serve the /uploads folder as static
router.use('/uploads', express.static('uploads')); // Allows public access to the uploads folder

// Use the auth middleware
router.use(authMiddleware);

// Route to get all employees
router.get('/', getEmployees);

// Route to create a new employee with a single image upload and compression
router.post('/', upload.single('f_Image'), async (req, res) => {
  try {
    let imageUrl = '';

    // If an image is uploaded, process and compress it
    if (req.file) {
      const compressedImagePath = `uploads/compressed-${req.file.filename}`;

      // Compress and resize image using sharp
      await sharp(req.file.path)
        .resize(500) // Resize to 500px width (keeping aspect ratio)
        .jpeg({ quality: 80 }) // Compress and convert to JPEG with 80% quality
        .toFile(compressedImagePath);

      // Delete the original uncompressed image (optional)
      fs.unlinkSync(req.file.path);

      // Set the image URL to the path of the compressed image
      imageUrl = `/uploads/compressed-${req.file.filename}`;
    }

    // Add the image URL to the employee data
    const employeeData = { ...req.body, f_Image: imageUrl };

    // Save the employee with the compressed image URL
    const employee = await createEmployee(employeeData);

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error while creating employee:', error);
    res.status(503).json({ error: 'Failed to create employee' });
  }
});

// Route to update an employee with a single image upload and compression
router.put('/:id', upload.single('f_Image'), async (req, res) => {
  try {
    let imageUrl = '';

    // If a new image is uploaded, process and compress it
    if (req.file) {
      const compressedImagePath = `uploads/compressed-${req.file.filename}`;

      // Compress and resize image using sharp
      await sharp(req.file.path)
        .resize(500) // Resize to 500px width (keeping aspect ratio)
        .jpeg({ quality: 80 }) // Compress and convert to JPEG with 80% quality
        .toFile(compressedImagePath);

      // Delete the original uncompressed image (optional)
      fs.unlinkSync(req.file.path);

      // Set the image URL to the path of the compressed image
      imageUrl = `/uploads/compressed-${req.file.filename}`;
    }

    // Construct employee data
    const employeeData = {
      f_Name: req.body.name,
      f_Email: req.body.email,
      f_Mobile: req.body.mobileNo,
      f_Designation: req.body.designation,
      f_Gender: req.body.gender,
      f_Course: req.body.course,
    };

    // Include image URL if available
    if (imageUrl) {
      employeeData.f_Image = imageUrl;
    }

    // Update the employee with the new data
    const updatedEmployee = await updateEmployee(req.params.id, employeeData);

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Failed to update employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Route to delete an employee
router.delete('/:id', deleteEmployee);

export default router;
