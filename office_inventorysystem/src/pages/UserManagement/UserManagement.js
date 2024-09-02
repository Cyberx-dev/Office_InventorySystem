import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import { Space, Table, Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EditOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import './UserManagement.css';
import axios from 'axios';

export default function UserManagement() {
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [isRemoveVisible, setIsRemoveVisible] = useState(false);
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get('http://localhost:5000/employees')
            .then(response => {
                setEmployees(response.data);
                setFilterUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the employees!', error);
            });
    };

    const handleSearch = (e) => {
        const searchItem = e.target.value.toUpperCase();
        const filtered = employees.filter(item =>
            Object.values(item).some(val =>
                String(val).toUpperCase().includes(searchItem)
            )
        );
        setFilterUsers(filtered);
    };

    const showUpdateModal = () => setIsUpdateVisible(true);
    const showRemoveModal = () => setIsRemoveVisible(true);
    const showAddModal = () => setIsAddVisible(true);

    const handleCancel = () => {
        setIsUpdateVisible(false);
        setIsRemoveVisible(false);
        setIsAddVisible(false);
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        
        const form = event.target;

        const formData = {
            employeeName: event.target.employeeName.value,
            employeeID: event.target.employeeID.value,
            email: event.target.email.value,
            phoneNumber: event.target.phoneNumber.value,
        };

        fetch('http://localhost:5000/update_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Update User Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('User updated successfully!');
                form.reset();
                fetchEmployees();
            } else {
                alert(`User update failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`User update failed: ${error.message}`);
            form.reset();
        });

        handleCancel();
    };

    const handleRemove = (event) => {
        event.preventDefault();
        
        const form = event.target;

        const formData = {
            employeeID: event.target.employeeID.value,
            employeeName: event.target.employeeName.value
        };

        fetch('http://localhost:5000/remove_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('User Removal Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('User removed successfully!');
                form.reset();
                fetchEmployees();
            } else {
                alert(`User removal failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`User removal failed: ${error.message}`);
            form.reset();
        });

        handleCancel();
    };

    const handleAdd = (event) => {
        event.preventDefault();
        
        const form = event.target;

        const formData = {
            employeeName: event.target.employeeName.value,
            employeeID: event.target.employeeID.value,
            email: event.target.email.value,
            phoneNumber: event.target.phoneNumber.value,
        };

        fetch('http://localhost:5000/add_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('User Add Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('User added successfully!');
                form.reset();
                fetchEmployees();
            } else {
                alert(`User add failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`User add failed: ${error.message}`);
            form.reset();
        });

        handleCancel();
    };

    return (
        <div>
            <Header />
            <Space className='Content'>
                <SideMenu />
                <Space direction="vertical" style={{ width: '100%' }}>
                    <h1 className='pageTitle'>User Management System </h1>
                    <Space>
                        <Button icon={<EditOutlined style={{ fontSize: '18px', color: '#ffa500' }} />} onClick={showUpdateModal} />
                        <Button icon={<UserAddOutlined style={{ fontSize: '18px', color: '#52c41a' }} />} onClick={showAddModal} />
                        <Button icon={<UserDeleteOutlined style={{ fontSize: '18px', color: '#f5222d' }} />} onClick={showRemoveModal} />
                    </Space>
                    <UpdateUser
                        visible={isUpdateVisible}
                        onCancel={handleCancel}
                        onSubmit={handleUpdate}
                        title="Edit Employee Details"
                    />
                    <AddUser
                        visible={isAddVisible}
                        onCancel={handleCancel}
                        onSubmit={handleAdd}
                        title="Add Employee"
                    />
                    <RemoveUser
                        visible={isRemoveVisible}
                        onCancel={handleCancel}
                        onSubmit={handleRemove}
                        title="Remove Employee"
                    />
                    <div className="employees-container">
                        <EmployeesTable employees={employees} />
                    </div>
                </Space>
            </Space>
        </div>
    );
}

const EmployeesTable = ({ employees }) => {
    const columns = [
        {title: '#', dataIndex: 'index', key: 'index', render: (text, record, index) => index + 1},
        {title: 'Employee ID', dataIndex: 'emplID', key: 'emplID'},
        {title: 'Employee Name', dataIndex: 'emplName', key: 'emplName'},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {title: 'Phone Number', dataIndex: 'contact', key: 'contact'}
    ]

    const dataSource = employees.map((employee, index) => ({
        ...employee,
        key: index,
    }));

    return (
        <Table
            className='employees-table'
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
    );
};


const AddUser = ({ visible, onCancel, onSubmit, title }) => (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <form name="add_empl" onSubmit={onSubmit}>
            <div>
                <label>Employee ID:</label>
                <input type="text" name="employeeID" required />
            </div>
            <div>
                <label>Employee Name:</label>
                <input type="text" name="employeeName" required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNumber" required />
            </div>
            <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                <button type="submit" className="submit-button">Add User</button>
            </div>
        </form>
    </Modal>
);

const UpdateUser = ({ visible, onCancel, onSubmit, title }) => (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <form name="update_empl" onSubmit={onSubmit}>
            <div>
                <label>Employee ID:</label>
                <input type="text" name="employeeID" required />
            </div>
            <div>
                <label>Employee Name:</label>
                <input type="text" name="employeeName" required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNumber" required />
            </div>
            <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                <button type="submit" className="submit-button">Update User</button>
            </div>
        </form>
    </Modal>
);

const RemoveUser = ({ visible, onCancel, onSubmit, title }) => (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <form name="remove_empl" onSubmit={onSubmit}>
            <div>
                <label>Employee Name:</label>
                <input type="text" name="employeeName" required />
            </div>
            <div>
                <label>Employee ID:</label>
                <input type="text" name="employeeID" required />
            </div>
            <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                <button type="submit" className="submit-button">Remove User</button>
            </div>
        </form>
    </Modal>
);
