import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import EmployeeSideMenu from '../../components/EmployeeSideMenu';
import { Space, Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import './Inventory.css';

export default function EmployeeInventory() {
    const [inventory, setInventory] = useState([]);
    const [filterInventory, setFilterInventory] = useState([]);

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

    const exportToPDF = () => {
        const doc = new jsPDF();
        html2canvas(document.querySelector(".inventory-table")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            doc.addImage(imgData, 'PNG', 10, 10, 190, 310);
            doc.save('Inventory.pdf');
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filterInventory);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        XLSX.writeFile(workbook, 'Inventory.xlsx');
    };

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
                            <Button icon={<FaFilePdf />} type="primary" onClick={exportToPDF}>
                                Export to PDF
                            </Button>
                            <Button icon={<BsFiletypeXlsx />} type="primary" onClick={exportToExcel}>
                                Export to Xlsx
                            </Button>
                        </Space>
                    </Space>
                    <InventoryDisplay inventory_items={filterInventory} />
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
