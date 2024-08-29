import React, {useState, useEffect} from 'react';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import { Space } from 'antd';
import axios from 'axios';
import './Reports.css'


export default function Reports() {
    const [reports, setReports] = useState([])

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = () => {
        axios.get('http://localhost:5000/reports')
        .then(response => {
            setReports(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the reports!')
        });
    };


    return (
        <div>
            <Header />
            <Space className='Content'>
                <SideMenu />
                <Space direction="vertical" style={{ width: '100%' }}>
                    <h1 className='pageTitle'>Office Invetory Reports</h1>
                    <DisplayReports report_items={reports}/>
                </Space>
            </Space>
        </div>
    )
}

const DisplayReports = ({report_items}) => (
    <table className='reports-table'>
        <thead>
            <tr>
                <th className='table-header' colSpan='6'>Inventory Reports</th>
            </tr>
            <tr>
                <th>#</th>
                <th>Assignment ID</th>
                <th>Employee ID</th>
                <th>Equipment ID</th>
                <th>Assignment Date</th>
                <th>Return Date</th>
            </tr>
        </thead>
        <tbody>
            {report_items.map((reports, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{reports.assignment_id}</td>
                    <td>{reports.employee_id}</td>
                    <td>{reports.equipment_id}</td>
                    <td>{reports.assignment_date}</td>
                    <td>{reports.return_date}</td>
                </tr>
            ))}
        </tbody>
    </table>
)
