import Employee from '../models/Employee.js';

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  const {
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_Gender,
    f_Course,
    f_Image,
  } = req.body;

  const employee = new Employee({
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_Gender,
    f_Course,
    f_Image,
  });

  try {
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    await Employee.findByIdAndDelete(id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getEmployees, createEmployee, updateEmployee, deleteEmployee };
