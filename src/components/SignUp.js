import React, { useState } from 'react'
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase_config';

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const createAccount = (e) => {
        console.log('inside create account');
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                console.log(userCredentials)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }




    return (
        <div>
            <form onSubmit={createAccount}>
                <h1>Create a New Account</h1>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Create Account</button>
            </form>
        </div>
    )
}
