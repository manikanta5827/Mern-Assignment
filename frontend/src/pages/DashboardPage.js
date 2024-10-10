import React, { useEffect, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import api from '../api';

const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get('/employees');
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

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
    setEmployees(employees.filter(emp => emp._id !== id));
    setNotification('Employee deleted successfully!');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => { setModalOpen(true); setSelectedEmployee(null); }}>Add Employee</button>
      <EmployeeTable data={employees} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <EmployeeForm onSubmit={handleAddEmployee} initialData={selectedEmployee} />
      </Modal>
      <Notification message={notification} onClose={() => setNotification('')} />
    </div>
  );
};

export default DashboardPage;
