import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import EmployeeSideMenu from '../../components/EmployeeSideMenu';
import { Space, Row, Col } from 'antd';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    ChartDataLabels
);

export default function EmployeeDashboard() {
    const [inventoryData, setInventoryData] = useState({});

    useEffect(() => {
        
        fetch('/api/inventory_summary')
            .then(response => response.json())
            .then(data => setInventoryData(data))
            .catch(error => console.error('Error fetching inventory data:', error));

    }, []);

    
    const inventoryChartData = {
        labels: Object.keys(inventoryData),
        datasets: [
            {
                label: 'Inventory by Type',
                data: Object.values(inventoryData),
                backgroundColor: [
                    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFDB33', '#33FFF2',
                    '#A633FF', '#FF3333', '#33FFCC', '#FFD433', '#33AFFF', '#FF8633'
                ],
                hoverOffset: 4
            },
        ],
    };


    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                display: true,
                color: 'black',
                font: {
                    weight: 'italic',
                },
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${value} (${label})`;
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <Header />
            <Space className='Content'>
                <EmployeeSideMenu />
                <Space direction="vertical" style={{ padding: '20px', width: '100%' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <h1 className='pageTitle'>Inventory Overview</h1>
                            <div style={{ position: 'relative', height: '550px' }}>
                                <Pie data={inventoryChartData} options={chartOptions} />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{marginLeft: '250px' }}>
                                <h1 className='pageTitle'>Calendar</h1>
                                <div style={{ position: 'relative', height: '600px', padding: '0 20px'}}>
                                    <Calendar
                                        view='month'
                                    />
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Space>
            </Space>
        </div>
    );
}
