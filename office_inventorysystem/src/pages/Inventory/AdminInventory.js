import React, { useState, useEffect} from 'react'
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import { Space } from 'antd';
import axios from 'axios';
import './Inventory.css'

export default function Inventory() {
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = () => {
        axios.get('http://localhost:5000/inventory')
            .then(response => {
                setInventory(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the inventory items!', error);
            });
    };


    return (
        <div>
            <Header />
            <Space className='Content'>
                <SideMenu />
                <Space direction="vertical" style={{ width: '100%' }}>
                    <h1 className='pageTitle'>Invetory Overview</h1>
                    <InventoryDisplay inventory_items={inventory}/>
                </Space>
            </Space>
        </div>
    )
}

const InventoryDisplay = ({inventory_items}) => (
    <table className='inventory-table'>
        <thead>
            <tr>
                <th className="table-header" colSpan="8">Inventory</th>
            </tr>
            <tr>
                <th>#</th>
                <th>Equipment ID</th>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Condition</th>
                <th>Location</th>
                <th>Assignment</th>
                <th>Purchase Date</th>
            </tr>
        </thead>
        <tbody>
            {inventory_items.map((inventory, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{inventory.equipment_id}</td>
                    <td>{inventory.name}</td>
                    <td>{inventory.type}</td>
                    <td>{inventory.condition}</td>
                    <td>{inventory.location}</td>
                    <td>{inventory.assigned_to}</td>
                    <td>{inventory.purchase_date}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

