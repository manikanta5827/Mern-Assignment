import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

// console.log('clou: ', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer for handling file uploads (using memory storage for temporary storage)
const upload = multer({ storage: multer.memoryStorage() });

// Function to upload a single file buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  console.log('In file upload');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'Employees' }, // Optional: specify a folder in Cloudinary
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const router = express.Router();

// Use the auth middleware
router.use(authMiddleware);

// Route to get all employees
router.get('/', getEmployees);

// Route to create a new employee with a single image upload
router.post('/', upload.single('f_Image'), async (req, res) => {
  console.log('Hii');

  console.log('body: ', req.body);

  try {
    let imageUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url; // Get the secure URL of the uploaded image
    }

    // Add the image URL to the employee data
    const employeeData = { ...req.body, f_Image: imageUrl };
    console.log('Employee data:', employeeData);

    // Save the employee with the image URL
    const employee = await createEmployee(employeeData);
    console.log('Employee saved:', employee);

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error while creating employee:');
    res.status(503).json({ error: 'Failed to create employee' });
  }
});

// Route to update an employee with a single image upload
router.put('/:id', upload.single('f_Image'), async (req, res) => {
  try {
    let imageUrl = '';

    // If a new image is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url; // Get the secure URL of the uploaded image
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
    console.log(req.params.id, employeeData);
    const updatedEmployee = await updateEmployee(req.params.id, employeeData);
    console.log('Updated Employee:', updatedEmployee);

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Failed to update employee:');
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Route to delete an employee
router.delete('/:id', deleteEmployee);

export default router;
