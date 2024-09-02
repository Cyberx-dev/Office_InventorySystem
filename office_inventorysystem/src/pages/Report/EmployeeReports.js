import React, {useState, useEffect} from 'react';
import Header from '../../components/Header';
import EmployeeSideMenu from '../../components/EmployeeSideMenu';
import { Space, Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import './Reports.css'


export default function EmployeeReports() {
    const [reports, setReports] = useState([]);
    const [filterReports, setFilterReports] = useState([]);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = () => {
        axios.get('http://localhost:5000/reports')
        .then(response => {
            setReports(response.data);
            setFilterReports(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the reports!')
        });
    };

    const handleSearch = (e) => {
        const searchItem = e.target.value.toUpperCase();
        const filtered = reports.filter(item =>
            Object.values(item).some(val =>
                String(val).toUpperCase().includes(searchItem)
            )
        );
        setFilterReports(filtered);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        html2canvas(document.querySelector(".reports-table")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            doc.addImage(imgData, 'PNG', 10, 10, 190, 310);
            doc.save('Reports.pdf');
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filterReports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
        XLSX.writeFile(workbook, 'Reports.xlsx');
    };


    return (
        <div>
            <Header />
            <Space className='Content'>
                <EmployeeSideMenu />
                <Space direction="vertical" style={{ width: '100%', marginLeft: '40px', marginTop: '-20px'}}>
                    <h1 className='pageTitle'>Office Inventory Reports</h1>
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
                    <DisplayReports report_items={reports}/>
                </Space>
            </Space>
        </div>
    )
}

const DisplayReports = ({report_items}) => {
    const columns = [
        { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1 },
        { title: 'Assignment ID', dataIndex: 'assignment_id', key: 'assignment_id' },
        { title: 'Employee ID', dataIndex: 'employee_id', key: 'employee_id' },
        { title: 'Equipment ID', dataIndex: 'equipment_id', key: 'equipment_id' },
        { title: 'Assignment Date', dataIndex: 'assignment_date', key: 'assignment_date' },
        { title: 'Return Date', dataIndex: 'return_date', key: 'return_date' }
    ];

    const dataSource = report_items.map((item, index) => ({
        ...item,
        key: index,
    }));

    return (
        <Table
            className='reports-table'
            columns={columns}
            dataSource={dataSource}
            bordered
            title={() => <div className="table-header">Inventory Reports</div>}
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
    );
};