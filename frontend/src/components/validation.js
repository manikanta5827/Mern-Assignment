// validation.js
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required.')
    .matches(/^[a-zA-Z\s]+$/, 'Name cannot contain numbers.'),
  email: Yup.string()
    .required('Email is required.')
    .email('Invalid email format.'),
  mobileNo: Yup.string()
    .required('Mobile number is required.')
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  designation: Yup.string().required('Designation is required.'),
  gender: Yup.string().required('Gender is required.'),
  course: Yup.array().required('At least one course is required.'),
  image: Yup.mixed()
    .nullable()
    .test('fileSize', 'Only JPEG, PNG, and GIF files are allowed.', 
      value => !value || (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))),
});
