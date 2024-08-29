import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import { Space, Button, Divider} from 'antd';
import { MdOutlineAccountBalance } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { FaChalkboardUser } from "react-icons/fa6";
import './Settings.css';


const ChangePassword = () => {
    
    const [userID, setID] = useState(false)

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            axios.get(`http://localhost:5000/user/${userId}`)
            .then(response => {
                if (response.data.staffId) {
                    setID(response.data.staffId);
                }
                else {
                    console.log('User not found');
                }
            })
            .catch(error => {
                console.error('There was an error fetching the user data!', error);
            });
        }
    }, []);

    const handleChangePass = (event) => {
        event.preventDefault();

        const form = event.target;
        

        const formData = {
            oldPass: form.oldPass.value,
            newPass: form.newPass.value,
            confirmPass: form.confirmPass.value,
            staffId: userID,
        };

        fetch('http://localhost:5000/update_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Password Change Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(`Password changed successfully!`);
                form.reset();
            } else {
                alert(`Password change failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Password change failed: ${error.meassage}`);
            form.reset();
        });
    };

    return(
        <div className='ChangePasscontainer'>
            <form name="change_pass" onSubmit={handleChangePass}>
                <div>
                    <label>Change Password</label>
                    <input type="password" name="oldPass" placeholder='Old Password' required/>
                    <input type="password" name="newPass" placeholder='New Password' required/>
                    <input type="password" name="confirmPass" placeholder='Repeat New Password' required/>
                </div>
                <div className="settings-button">
                    <button type="submit" className="changePass-button">Save Changes</button>
                </div>
            </form>
        </div>
    )
};

const Account = () => {
    const [userName, setUserName] = useState(false)
    const [userID, setID] = useState(false)
    const [userPosition, setPoistion] = useState(false)
    const [userEmail, setEmail] = useState(false)


    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            axios.get(`http://localhost:5000/user/${userId}`)
            .then(response => {
                if (response.data.name) {
                    setUserName(response.data.name);
                }
                if (response.data.staffId) {
                    setID(response.data.staffId);
                }
                if (response.data.position) {
                    setPoistion(response.data.position);
                }
                if (response.data.email) {
                    setEmail(response.data.email);
                } 
                else {
                    console.log('User not found');
                }
            })
            .catch(error => {
                console.error('There was an error fetching the user data!', error);
            });
        }
    }, []);

    return(
        <div>

            <h1 className='pageTitle'>Account Overview</h1>

            <div className="account-container">
                    <FaChalkboardUser style={{fontSize: 100}}/>
                    <h3>Contact Details</h3>
                    <form className="account-form">
                        
                        <div className="form-group">
                            <div className="input-field">
                                <label>Name</label>
                                <input type="text" disabled/>
                                <text className='input-placeholder'>{userName}</text>
                            </div>
                            <div className="input-field">
                                <label>Staff ID</label>
                                <input type="text" disabled/>
                                <text className='input-placeholder'>{userID}</text>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-field">
                                <label>Position</label>
                                <input type="text" disabled/>
                                <text className='input-placeholder'>{userPosition}</text>
                            </div>
                            <div className="input-field">
                                <label>Email</label>
                                <input type="text" disabled/>
                                <text className='input-placeholder'>{userEmail}</text>
                            </div>
                        </div>
                    </form>
                </div>
                
        </div>
        
    )
};



export default function Settings() {

    const [content, setContent] = useState('');

    return (
        <div>
            <Header />
            <Space className='Content'>
                <SideMenu />

                <Space direction='vertical' style={{marginLeft: 30}}>
                    <h3>GENERAL</h3>
                        <Space style={{marginTop: -30}}>
                            <Button className='custom-btn' icon={<MdOutlineAccountBalance style={{ fontSize: '18px'}} />} onClick={() => setContent('Account')}>
                                <h4>Account</h4> 
                            </Button>
                        </Space>
                    <h3>OTHER</h3>
                    <Space style={{marginTop: -30}}>
                        <Button className='custom-btn' icon={<TbPasswordUser style={{ fontSize: '18px'}} />} onClick={() => setContent('ChangePassword')}>
                            <h4>Change Password</h4>
                        </Button>
                    </Space>
                </Space>

                <Divider type="vertical" style={{ height: '100vh', marginLeft: 20, marginRight: 10, backgroundColor: '#AFB0B6'}} />

                <Space>
                    {content === 'Account' && <Account />}
                    {content === 'ChangePassword' && <ChangePassword />}
                </Space>

            </Space>
        </div>
    )
}