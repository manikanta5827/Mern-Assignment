import React, { useEffect } from 'react';
import '../styles/EmployeeForm.css'; // Import the updated CSS
import { validationSchema } from './validation'; // Import the validation schema
import InputField from './InputField'; // Import the InputField component
import { Formik } from 'formik';

const EmployeeForm = ({ onSubmit, initialData }) => {
  // Initial data to populate the form
  const initialValues = {
    name: initialData?.f_Name || '',
    email: initialData?.f_Email || '',
    mobileNo: initialData?.f_Mobile || '',
    designation: initialData?.f_Designation || '',
    gender: initialData?.f_Gender || '',
    course: initialData?.f_Course || [],
    image: null, 
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('mobileNo', values.mobileNo);
        formData.append('designation', values.designation);
        formData.append('gender', values.gender);
        values.course.forEach((course) => formData.append('course', course));
        if (values.image) {
          formData.append('f_Image', values.image);
        }
        onSubmit(formData);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
        <form onSubmit={handleSubmit} className="employee-form">
          <InputField
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Name"
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <InputField
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <InputField
            label="Mobile No"
            name="mobileNo"
            value={values.mobileNo}
            onChange={handleChange}
            placeholder="Mobile No"
          />
          {errors.mobileNo && <span className="error">{errors.mobileNo}</span>}

          <select
            name="designation"
            value={values.designation}
            onChange={handleChange}
            required
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <span className="error">{errors.designation}</span>}

          <div>
            <label>Gender:</label>
            <label>
              <input
                type="radio"
                name="gender"
                value="M"
                checked={values.gender === 'M'}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="F"
                checked={values.gender === 'F'}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
          {errors.gender && <span className="error">{errors.gender}</span>}

          <div>
            <label>Course:</label>
            <label>
              <input
                type="checkbox"
                name="course"
                value="MCA"
                checked={values.course.includes('MCA')}
                onChange={() => {
                  const newCourses = values.course.includes('MCA')
                    ? values.course.filter((c) => c !== 'MCA')
                    : [...values.course, 'MCA'];
                  setFieldValue('course', newCourses);
                }}
              />
              MCA
            </label>
            <label>
              <input
                type="checkbox"
                name="course"
                value="BCA"
                checked={values.course.includes('BCA')}
                onChange={() => {
                  const newCourses = values.course.includes('BCA')
                    ? values.course.filter((c) => c !== 'BCA')
                    : [...values.course, 'BCA'];
                  setFieldValue('course', newCourses);
                }}
              />
              BCA
            </label>
            <label>
              <input
                type="checkbox"
                name="course"
                value="BSC"
                checked={values.course.includes('BSC')}
                onChange={() => {
                  const newCourses = values.course.includes('BSC')
                    ? values.course.filter((c) => c !== 'BSC')
                    : [...values.course, 'BSC'];
                  setFieldValue('course', newCourses);
                }}
              />
              BSC
            </label>
          </div>
          {errors.course && <span className="error">{errors.course}</span>}

          <input
            type="file"
            onChange={(event) => {
              setFieldValue('image', event.currentTarget.files[0]);
            }}
          />
          {errors.image && <span className="error">{errors.image}</span>}

          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};

export default EmployeeForm;
