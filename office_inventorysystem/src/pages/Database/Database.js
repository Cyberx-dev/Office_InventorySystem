import React, { useState} from 'react';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import './Database.css';
import { Space, Button, Divider} from 'antd';
import { MdOutlineInventory } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { BiCartAdd } from "react-icons/bi";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";


const AddToInventory = () => {

    const handleAddToInventory = (event) => {
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
            } else {
                alert(`Item add failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Item add failed: ${error.message}`);
            form.reset();
        });
    }

    return(
        <div className='DatabaseFormContainer'>
            <form name='additem' onSubmit={handleAddToInventory}>
                <div>
                    <label>Add Item To Inventory</label>
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
        </div>
    )
}

const RemoveItem = () => {

    const handleRemoveItem = (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            equipmentID: form.equipmentID.value,
            equipmentName: form.equipmentName.value,
        };

        fetch('http://localhost:5000/remove_inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Inventory Item Removal Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Inventory Item removed successfully!');
                form.reset();
            } else {
                alert(`Inventory Item removal failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Inventory Item removal failed: ${error.message}`);
            form.reset();
        });
    }

    return(
        <div className='DatabaseFormContainer'>
            <form name='removeitem' onSubmit={handleRemoveItem}>
                <div>
                    <label>Remove Item From Inventory</label>
                    <input type="text" name="equipmentID" placeholder='Equipment ID' required/>
                    <input type="text" name="equipmentName" placeholder='Equipment Name' required/>
                </div>
                <div className='form-button'>
                    <button type="submit" className='remove-button'>Remove Item</button>
                </div>
            </form>
        </div>
    )
}

const UpdateItem = () => {

    const handleUpdateItem = (event) => {
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
            } else {
                alert(`Inventory Item update failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Inventory Item update failed: ${error.message}`);
            form.reset();
        });
    }

    return(
        <div className='DatabaseFormContainer'>
        <form name='updateitem'onSubmit={handleUpdateItem}>
            <div>
                <h2>Update Inventory Item</h2>
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
    </div>
    )
}

const AddRecord = () => {

    const handleAddRecord = (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            assignmentID: form.assignmentID.value,
            employeeID: form.employeeID.value,
            equipmentID: form.equipmentID.value,
            assignmentDate: form.assignmentDate.value,
            date: form.date.value
        };

        fetch('http://localhost:5000/add_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Report Item Add Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Report Item added successfully!');
                form.reset();
            } else {
                alert(`Report Item add failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Report Item add failed: ${error.message}`);
            form.reset();
        });
    }

    return(
        <div className='DatabaseFormContainer'>
            <form name='addrecord' onSubmit={handleAddRecord}>
                <div>
                    <label>Add Report</label>
                    <input type="text" name="assignmentID" placeholder='Assignment ID' required/>
                    <input type="text" name="employeeID" placeholder='Employee ID' required/>
                    <input type="text" name="equipmentID" placeholder='Equipment ID' required/>
                    <input type="text" name="assignmentDate" placeholder='Assignment Date (YYYY-MM-DD)' required/>
                    <input type="text" name="date" placeholder='Return Date (YYYY-MM-DD)' required/>
                </div>
                <div className='form-button'>
                    <button type="submit" className='add-button'>Add Record</button>
                </div>
            </form>
        </div>
    )
}

const UpdateRecord = () => {

    const handleUpdateRecord = (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            assignmentID: form.assignmentID.value,
            employeeID: form.employeeID.value,
            equipmentID: form.equipmentID.value,
            assignmentDate: form.assignmentDate.value,
            returnDate: form.returnDate.value
        };

        fetch('http://localhost:5000/update_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Update Report Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Report updated successfully!');
                form.reset();
            } else {
                alert(`Report update failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Report update failed: ${error.message}`);
            form.reset();
        });
    }

    return(
        <div className='DatabaseFormContainer'>
        <form name='updaterecord' onSubmit={handleUpdateRecord}>
            <div>
                <h2>Update Report Item</h2>
                <label>Assignment ID For Record Update</label>
                <input type="text" name="assignmentID" placeholder='Assignment ID' required/>
                <label>Update Details</label>
                <input type="text" name="employeeID" placeholder='Employee ID' required/>
                <input type="text" name="equipmentID" placeholder='Equipment ID' required/>
                <input type="text" name="assignmentDate" placeholder='Assignment Date (YYYY-MM-DD)' required/>
                <input type="text" name="returnDate" placeholder='Return Date (YYYY-MM-DD)' required/>
            </div>
            <div className='form-button'>
                <button type="submit" className='update-button'>Update Item</button>
            </div>
        </form>
    </div>
    )
}

export default function Database() {

    const [content, setContent] = useState('')
    return (
        <div>
            <Header />
            <Space className='Content'>
                <SideMenu />
                
                <Space direction='vertical' style={{marginLeft: 30}}>
                    <h3>INVENTORY</h3>
                        <Space style={{marginTop: -30}} direction='vertical'>
                            <Button className='custom-btn' icon={<BiCartAdd style={{ fontSize: '18px'}} />} onClick={() => setContent('AddItem')}>
                                <h4>Add Item</h4> 
                            </Button>
                            <Button className='custom-btn' icon={<MdOutlineRemoveShoppingCart style={{ fontSize: '18px'}} />} onClick={() => setContent('RemoveItem')}>
                                <h4>Remove Item</h4> 
                            </Button>
                            <Button className='custom-btn' icon={<MdOutlineInventory style={{ fontSize: '18px'}} />} onClick={() => setContent('UpdateItem')}>
                                <h4>Update Item</h4> 
                            </Button>
                        </Space>
                    <h3>REPORTS</h3>
                    <Space style={{marginTop: -30}} direction='vertical'>
                        <Button className='custom-btn' icon={<MdOutlinePostAdd style={{ fontSize: '18px'}} />} onClick={() => setContent('AddRecord')}>
                            <h4>Add Record</h4>
                        </Button>
                        <Button className='custom-btn' icon={<GrDocumentUpdate style={{ fontSize: '18px'}} />} onClick={() => setContent('UpdateRecord')}>
                            <h4>Update Record</h4>
                        </Button>
                    </Space>
                </Space>

                <Divider type="vertical" style={{ height: '100vh', marginLeft: 20, marginRight: 10, backgroundColor: '#AFB0B6'}} />

                <Space>
                    {content === 'AddItem' && <AddToInventory />}
                    {content === 'RemoveItem' && <RemoveItem />}
                    {content === 'UpdateItem' && <UpdateItem />}
                    {content === 'AddRecord' && <AddRecord />}
                    {content === 'UpdateRecord' && <UpdateRecord />}
                </Space>
            </Space>
        </div>
    )
}

