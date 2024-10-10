import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true, unique: true },
  f_Mobile: { type: String, required: true },
  f_Designation: { type: String, required: true },
  f_Gender: { type: String, enum: ['M', 'F'], required: true },
  f_Course: { type: [String], required: true },
  f_Image: { type: String },
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
