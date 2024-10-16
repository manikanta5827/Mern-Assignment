import React, { useState, useEffect } from 'react';
import '../styles/EmployeeForm.css'; // Import the updated CSS

const EmployeeForm = ({ onSubmit, initialData }) => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: [],
    image: null,
  });

  // Prefill form fields with initialData (if available)
  useEffect(() => {
    if (initialData) {
      setEmployee({
        name: initialData.f_Name || '',
        email: initialData.f_Email || '',
        mobileNo: initialData.f_Mobile || '',
        designation: initialData.f_Designation || '',
        gender: initialData.f_Gender || '',
        course: initialData.f_Course || [],
        image: null, // Leave image blank as files cannot be prefilled for security reasons
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setEmployee((prev) => {
        const newCourses = prev.course.includes(value)
          ? prev.course.filter((course) => course !== value)
          : [...prev.course, value];
        return { ...prev, course: newCourses };
      });
    } else {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setEmployee((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation (you can expand this as needed)
    if (!employee.name || !employee.email || !employee.mobileNo || 
        !employee.designation || !employee.gender || employee.course.length === 0 || 
        !employee.image) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobileNo', employee.mobileNo);
    formData.append('designation', employee.designation);
    formData.append('gender', employee.gender);
    employee.course.forEach((course) => formData.append('course', course));
    if (employee.image) {
      formData.append('f_Image', employee.image);
    }

    onSubmit(formData); // Pass formData to the parent component's handler
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <input
        name="name"
        value={employee.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        value={employee.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="mobileNo"
        value={employee.mobileNo}
        onChange={handleChange}
        placeholder="Mobile No"
        required
      />
      <select
        name="designation"
        value={employee.designation}
        onChange={handleChange}
        required
      >
        <option value="">Select Designation</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </select>
      <div>
        <label>Gender:</label>
        <label>
          <input
            type="radio"
            name="gender"
            value="M"
            checked={employee.gender === 'M'}
            onChange={handleChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="F"
            checked={employee.gender === 'F'}
            onChange={handleChange}
          />
          Female
        </label>
      </div>
      <div>
        <label>Course:</label>
        <label>
          <input
            type="checkbox"
            name="course"
            value="MCA"
            checked={employee.course.includes('MCA')}
            onChange={handleChange}
          />
          MCA
        </label>
        <label>
          <input
            type="checkbox"
            name="course"
            value="BCA"
            checked={employee.course.includes('BCA')}
            onChange={handleChange}
          />
          BCA
        </label>
        <label>
          <input
            type="checkbox"
            name="course"
            value="BSC"
            checked={employee.course.includes('BSC')}
            onChange={handleChange}
          />
          BSC
        </label>
      </div>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;
