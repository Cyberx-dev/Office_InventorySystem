import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaUserTie, FaMailBulk } from "react-icons/fa";

const Header = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
        setDropdownNotify(false);
    };

    const [dropdownNotify, setDropdownNotify] = useState(false);

    const toggleDropdownNotify = () => {
        setDropdownNotify(!dropdownNotify);
        setDropdownVisible(false);
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            // First, try to fetch user data from the Users collection
            axios.get(`http://localhost:5000/user/${userId}`)
                .then(response => {
                    if (response.data.name) {
                        setUserName(response.data.name);
                    } else {
                        // If not found in Users, try to fetch from Employees collection
                        axios.get(`http://localhost:5000/employee/${userId}`)
                            .then(response => {
                                if (response.data.emplName) {
                                    setUserName(response.data.emplName);
                                } else {
                                    console.log('User not found');
                                }
                            })
                            .catch(error => {
                                console.error('There was an error fetching the employee data!', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the user data!', error);
                });
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('userId');
        navigate('/', { replace: true });
    };

    return (
        <div>
            <div className='DashHeader'>
                <img src={require('../assets/dashboard-header.png')} style={{ height: 40 }} alt="Dashboard Header" />
                <Space>
                    <FaMailBulk style={{fontSize: 22, marginTop: 2}} className='messageIcon' onClick={toggleDropdownNotify}/>
                    {dropdownNotify &&(
                        <div className="dropdown-notify">
                            <div className='notify-item'>No Messages yet</div>
                        </div>
                    )}
                    <FaUserTie style={{ fontSize: 25 }} className='profileIcon' onClick={toggleDropdown}/>
                    {dropdownVisible &&(
                        <div className="dropdown-menu">
                            <div className='dropdown-item'>{userName}</div>
                            <div className="dropdown-item"><button onClick={handleSignOut} className='DashLogout'>LOG-OUT</button></div>
                        </div>
                    )}
                </Space>
            </div>
        </div>
    );
}

export default Header;
