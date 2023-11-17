import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function Account() {

    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async ()=>{
        try {
            await logout()
            navigate('/')
        } catch (error) {
        console.log(error.message);            
        }
    }
    return (
        <div>Account
            <div>
                <h1>Email:{user && user.email}</h1>
                <button type="button" class="btn btn-primary" onClick={handleLogout}>LogOut</button>
            </div>

        </div>


    )
}
