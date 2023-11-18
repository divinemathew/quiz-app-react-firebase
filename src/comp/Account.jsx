import React, { useEffect, useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { QuerySnapshot, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase_config';

export default function Account() {

    const [userList, setUserList] = useState('')
    const [question, setQuestion] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const q = query(collection(db, 'users'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let userArray = []
            querySnapshot.forEach((doc) => {
                userArray.push({ ...doc.data(), id: doc.id })
            });
            setUserList(userArray);
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        for (let index = 0; index < userList.length; index++) {
            if (userList[index].email === user.email) {
                setCurrentUser(userList[index])
            }
        }
    }, [userList])


    useEffect(() => {
        const q = query(collection(db, 'questions'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let questionArray = []
            querySnapshot.forEach((doc) => {
                questionArray.push({ ...doc.data(), id: doc.id })
            });
            setQuestion(questionArray);
        })
        return () => unsubscribe()
    }, [])

    return (
        <div>
            {currentUser &&
                <div>
                    Account
                    <div>
                        <h1>Email:{user && user.email}</h1>
                        {currentUser && currentUser.isAdmin === true && <div>
                            <h1>
                                Admin</h1></div>}
                        <button type="button" class="btn btn-primary" onClick={handleLogout}>LogOut</button>
                    </div>
                </div>}
        </div>


    )
}
