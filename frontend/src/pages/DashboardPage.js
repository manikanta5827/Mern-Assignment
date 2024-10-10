import React, { useEffect, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import api from '../api';
import { useAuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
  }, [isAuthenticated, navigate]);

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
      // Refetch employees
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      setNotification('Error occurred while saving employee.');
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
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h2>Good Afternoon, {user}!</h2>
      <button className="logout-button" onClick={logSession}>
        LOGOUT
      </button>
      <button
        className="add-button"
        onClick={() => {
          setModalOpen(true);
          setSelectedEmployee(null);
        }}
      >
        Add Employee
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
      <Notification
        message={notification}
        onClose={() => setNotification('')}
      />
    </div>
  );
};

export default DashboardPage;
