import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import login_image from '../assets/MOC-login.jpg';
import form_image from '../assets/login-form.jpg';

const SignIn = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const form = event.target;
    
        const formData = {
            staffId: event.target.staffId.value,
            password: event.target.password.value
        };
    
        fetch('http://localhost:5000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('User Sign In Failed!');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.setItem('userId', data.userId);
                navigate(data.dashboard, { replace: true });
            } else {
                alert(`Login failed: ${data.message}`);
                form.reset();
            }
        })
        .catch((error) => {
            alert(`Login failed: ${error.message}`);
            form.reset();
        });
    };
    
    return (
        <div className='container'>
            <div className='header'>
                <img src={login_image} alt='MOC LOGO'/>
            </div>

            <form name="signin_form" className='signIn' onSubmit={handleSubmit}>
                <div>
                    <img src={form_image} alt='FORM HEADER'/>
                </div>
                <div>
                    <label>STAFF ID:</label>
                    <input type="text" name="staffId" required />
                </div>
                <div>
                    <label>PASSWORD:</label>
                    <input type="password" name="password" required />
                </div>
                <button type='submit' className='SignInbutton'>Sign In</button>
            </form>
            <div className='tag'>
                © Powered by the CyberX Team
            </div>
        </div>
    );
};

export default SignIn;
