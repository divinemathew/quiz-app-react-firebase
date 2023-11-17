import React, { useState } from 'react'
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase_config';
import { toast } from 'react-toastify';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const logIn = (e) => {
        console.log('inside create account');
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log(userCredentials)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }




    return (
        <div>
            <form onSubmit={logIn}>
                <h1>Login</h1>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}
