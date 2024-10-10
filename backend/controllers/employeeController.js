import Employee from '../models/Employee.js';

const getEmployees = async (req, res) => {
  console.log('getEmployees');

  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (employeeData) => {
  console.log('Creating employee with data:', employeeData);

  const { name, email, mobileNo, designation, gender, course, f_Image } =
    employeeData;

  const employee = new Employee({
    f_Name: name,
    f_Email: email,
    f_Mobile: mobileNo,
    f_Designation: designation,
    f_Gender: gender,
    f_Course: course,
    f_Image,
  });

  try {
    const savedEmployee = await employee.save();
    console.log('Employee saved:', savedEmployee);
    return savedEmployee;
  } catch (error) {
    console.error('Error during employee creation:', error);
    throw new Error('Failed to save employee');
  }
};

const updateEmployee = async (id, updateData) => {
  // const { id } = req.params;

  // const f_Image = req.file ? req.file.path : null;
  // console.log(id, f_Image);

  // const updateData = {
  //   ...req.body,
  //   ...(f_Image && { f_Image }),
  // };
  console.log('Before', updateData);

  try {
    const updated = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      overwrite: true,
    });

    console.log('updates : ', updated);
    return updated;
  } catch (error) {
    throw new Error('failed to update employee', error);
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
