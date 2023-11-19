import React, { useEffect, useState } from 'react'
import { UserAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { QuerySnapshot, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase_config';

export default function Dashboard() {

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
        const q = query(collection(db, 'section1'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let questionArray = []
            querySnapshot.forEach((doc) => {
                questionArray.push({ ...doc.data(), id: doc.id })
            });
            setQuestion(questionArray);
            console.log(questionArray);
        })
        return () => unsubscribe()
    }, [])


    return (
        <div>
            {currentUser && question &&
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

            <form>
                <h1>Questions</h1>
                {question[0] && (
                    question.map((data) => (

                        <div class="form-group">
                            <label for="exampleInputEmail1">{data.question}</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                <label class="form-check-label" for="exampleRadios1">
                                    {data.A}
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                <label class="form-check-label" for="exampleRadios1">
                                {data.B}
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                <label class="form-check-label" for="exampleRadios1">
                                    {data.C}
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                <label class="form-check-label" for="exampleRadios1">
                                {data.D}
                                </label>
                            </div>
                        </div>

                    ))
                )}

                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>


    )
}
