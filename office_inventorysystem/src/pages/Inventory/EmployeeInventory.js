import React, { useState, useEffect} from 'react'
import Header from '../../components/Header';
import EmployeeSideMenu from '../../components/EmployeeSideMenu';
import { Space, Table, Input, Button, Modal, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './Inventory.css'
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import axios from 'axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { MdOutlineInventory } from "react-icons/md";
import { BiCartAdd } from "react-icons/bi";
import { LuFolderEdit } from 'react-icons/lu';
import { CiExport } from 'react-icons/ci';
import 'jspdf-autotable';

export default function EmployeeInventory() {
    const [inventory, setInventory] = useState([]);
    const [filterInventory, setFilterInventory] = useState([]);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [isAddVisible, setIsAddVisible] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = () => {
        axios.get('http://localhost:5000/inventory')
            .then(response => {
                setInventory(response.data);
                setFilterInventory(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the inventory items!', error);
            });
    };

    const handleSearch = (e) => {
        const searchItem = e.target.value.toUpperCase();
        const filtered = inventory.filter(item =>
            Object.values(item).some(val =>
                String(val).toUpperCase().includes(searchItem)
            )
        );
        setFilterInventory(filtered);
    };

    const showUpdateModal = () => setIsUpdateVisible(true);
    const showAddModal = () => setIsAddVisible(true);

    const handleCancel = () => {
        setIsUpdateVisible(false);
        setIsAddVisible(false);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const headers = [["Equipment ID", "Equipment Name", "Type", "Condition", "Location", "Assignment", "Purchase Date"]];
        const rows = filterInventory.map(item => [
            item.equipment_id,
            item.name, 
            item.type, 
            item.condition, 
            item.location, 
            item.assigned_to, 
            item.purchase_date
        ]);
        doc.autoTable({
            head: headers,
            body: rows,
            theme: 'grid',
            margin: { top: 20 },
            styles: { fontSize: 10, cellPadding: 3 },
        });
        doc.save('Inventory.pdf');
    };
    
    
    

    const exportToExcel = () => {
        const filteredData = filterInventory.map(item => ({
            "Equipment ID": item.equipment_id,
            "Equipment Name": item.name,
            "Type": item.type,
            "Condition": item.condition,
            "Location": item.location,
            "Assignment": item.assigned_to,
            "Purchase Date": item.purchase_date
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        XLSX.writeFile(workbook, 'Inventory.xlsx');
    };

    const handleAdd = (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            equipmentID: form.equipmentID.value,
            equipmentName: form.equipmentName.value,
            type: form.type.value,
            condition: form.condition.value,
            location: form.location.value,
            assignment: form.assignment.value,
            purchasedate: form.purchasedate.value,
        };

        fetch('http://localhost:5000/add_inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Item Add Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Item added successfully!');
                form.reset();
                fetchInventory();
            } else {
                alert(`Item add failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Item add failed: ${error.message}`);
            form.reset();
        });

        handleCancel();
    };

    const handleUpdate = (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            equipmentID: form.equipmentID.value,
            condition: form.condition.value,
            location: form.location.value,
            assignment: form.assignment.value,
        };

        fetch('http://localhost:5000/update_inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Update Inventory Item Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Inventory Item updated successfully!');
                form.reset();
                fetchInventory();
            } else {
                alert(`Inventory Item update failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Inventory Item update failed: ${error.message}`);
            form.reset();
        });

        handleCancel();
    };


    const exportMenu = (
        <Menu>
            <Menu.Item key="1" icon={<FaFilePdf style={{fontSize: '18px'}}/>} onClick={exportToPDF}>
                Export to PDF
            </Menu.Item>
            <Menu.Item key="2" icon={<BsFiletypeXlsx style={{fontSize: '18px'}}/>} onClick={exportToExcel}>
                Export to Excel
            </Menu.Item>
        </Menu>
    );

    const addUpdateMenu = (
        <Menu>
            <Menu.Item key="1" icon={<BiCartAdd style={{fontSize: '18px'}}/>} onClick={showAddModal}>
                Add To Inventory
            </Menu.Item>
            <Menu.Item key="2" icon={<MdOutlineInventory style={{fontSize: '18px'}}/>} onClick={showUpdateModal}>
                Update Inventory Item
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            <Header />
            <Space className='Content'>
            <EmployeeSideMenu />
                <Space direction="vertical" style={{ width: '100%', marginLeft: '40px', marginTop: '-20px'}}>
                    <h1 className='pageTitle'>Inventory Overview</h1>
                    <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                        <Input
                            placeholder="Search Inventory"
                            onChange={handleSearch}
                            style={{ width: 200 }}
                            prefix={<SearchOutlined />}
                        />
                        <Space>
                            <Dropdown overlay={exportMenu} trigger={['click']}>
                                <Button icon={<CiExport />} type="primary">
                                    Export
                                </Button>
                            </Dropdown>
                            <Dropdown overlay={addUpdateMenu} trigger={['click']}>
                                <Button icon={<LuFolderEdit />} type="primary">
                                    Edit
                                </Button>
                            </Dropdown>
                        </Space>
                        
                    </Space>
                    <InventoryDisplay inventory_items={filterInventory} />

                    <AddItem
                        visible={isAddVisible}
                        onCancel={handleCancel}
                        onSubmit={handleAdd}
                        title='Add Item to Inventory'
                    />

                    <UpdateItem 
                        visible={isUpdateVisible}
                        onCancel={handleCancel}
                        onSubmit={handleUpdate}
                        title='Update Inventory Item'
                    />

                </Space>
            </Space>
        </div>
    );
}

const InventoryDisplay = ({ inventory_items }) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Equipment ID',
            dataIndex: 'equipment_id',
            key: 'equipment_id',
        },
        {
            title: 'Equipment Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Condition',
            dataIndex: 'condition',
            key: 'condition',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Assignment',
            dataIndex: 'assigned_to',
            key: 'assigned_to',
        },
        {
            title: 'Purchase Date',
            dataIndex: 'purchase_date',
            key: 'purchase_date',
        },
    ];

    const dataSource = inventory_items.map((item, index) => ({
        ...item,
        key: index,
    }));

    return (
        <Table
            className='inventory-table'
            columns={columns}
            dataSource={dataSource}
            bordered
            title={() => <div className="table-header">Inventory</div>}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
    );
};

const AddItem = ({visible, onCancel, onSubmit, title}) => (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <form name='additem' onSubmit={onSubmit}>
            <div>
                <input type="text" name="equipmentID" placeholder='Equipment ID' required/>
                <input type="text" name="equipmentName" placeholder='Equipment Name' required/>
                <input type="text" name="type" placeholder='Type' required/>
                <input type="text" name="condition" placeholder='Condition' required/>
                <input type="text" name="location" placeholder='Location' required/>
                <input type="text" name="assignment" placeholder='Assignment' required/>
                <input type="text" name="purchasedate" placeholder='Purchase Date (YYYY-MM-DD)' required/>
            </div>
            <div className='form-button'>
                <button type="submit" className='add-button'>Add Item</button>
            </div>
        </form>
    </Modal>
);


const UpdateItem = ({visible, onCancel, onSubmit, title}) => (
    <Modal title={title} visible={visible} onCancel={onCancel} footer={null}>
        <form name='updateitem'onSubmit={onSubmit}>
            <div>
                <label>ID For Item Update</label>
                <input type="text" name="equipmentID" placeholder='Equipment ID' required/>
                <label>Update Details</label>
                <input type="text" name="condition" placeholder='Condition' required/>
                <input type="text" name="location" placeholder='Location' required/>
                <input type="text" name="assignment" placeholder='Assignment' required/>
            </div>
            <div className='form-button'>
                <button type="submit" className='update-button'>Update Item</button>
            </div>
        </form>
    </Modal>
);