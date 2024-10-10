import React, { useEffect, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import Modal from '../components/Modal';
import api from '../api';
import { useAuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx library for Excel download
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext(); // Get authentication status
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('name') || 'User');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [notification, setNotification] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/employees');
          setEmployees(response.data);
        } catch (error) {
          setNotification('Error fetching employees.');
        }
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    fetchEmployees();
  }, [isAuthenticated, navigate]); // Make sure navigate is in the dependency array

  // Function to handle Excel download
  const handleDownloadExcel = () => {
    // Convert employee data to the format suitable for Excel
    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((employee, index) => ({
        No: index + 1,
        Name: employee.f_Name,
        Email: employee.f_Email,
        'Mobile No': employee.f_Mobile,
        Designation: employee.f_Designation,
        Gender: employee.f_Gender,
        Course: employee.f_Course.join(', '),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

    // Trigger Excel file download
    XLSX.writeFile(workbook, 'EmployeeData.xlsx');
  };

  const handleAddEmployee = async (employee) => {
    try {
      if (selectedEmployee) {
        await api.put(`/employees/${selectedEmployee._id}`, employee);
        setNotification('Employee updated successfully!');
      } else {
        await api.post('/employees', employee);
        setNotification('Employee added successfully!');
      }
      setModalOpen(false);
      setSelectedEmployee(null);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setNotification(error.response.data.error);
      } else {
        setNotification('Error occurred while saving employee.');
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    setEmployees(employees.filter((emp) => emp._id !== id));
    setNotification('Employee deleted successfully!');
  };

  const logSession = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard" style={{ height: '90vh' }}>
      <div className="Header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={logSession}>
          <strong>LOGOUT</strong>
        </button>
      </div>
      <p>Good Afternoon, <strong>{user}</strong>!</p>

      <button
        className="add-button"
        onClick={() => {
          setModalOpen(true);
          setSelectedEmployee(null);
        }}
      >
        <strong> + Add Employee</strong>
      </button>

      {/* Add a button to download Excel */}
      <button className="download-button" onClick={handleDownloadExcel}>
        <strong>Download Excel</strong>
      </button>

      <EmployeeTable
        data={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <EmployeeForm
          onSubmit={handleAddEmployee}
          initialData={selectedEmployee}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
