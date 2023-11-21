import React, { useEffect, useState } from 'react'
import { UserAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { QuerySnapshot, Timestamp, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase_config';

export default function Dashboard() {

    const [userList, setUserList] = useState('')
    const [question, setQuestion] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [score, setScore] = useState(0)
    const [quesIndex, setQuesIndex] = useState(0)
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


    const updateScore = async (finalScore) => {
        const userRef = doc(db, 'users', currentUser.id)
        await updateDoc(userRef, {
            highscore: finalScore,
            timeStamp: Timestamp.now()
        })
        setScore(0);
        setQuesIndex(0);
        alert("Please Restart the Quiz");
        window.location.reload()
    }
    const handleOptions = (e) => {
        console.log(e.isCorrect);
        if (quesIndex < (question.length - 1)) {
            setQuesIndex(quesIndex + 1)
            if (e.isCorrect) {
                setScore(score + 1);
            }
            else {
                setScore(score - 1)
            }
        } else {
            if (e.isCorrect) {
                setScore(score + 1);
            }
            else {
                setScore(score - 1)
            }
            updateScore(score);
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
        const q = query(collection(db, 'section4'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let questionArray = []
            querySnapshot.forEach((doc) => {
                questionArray.push({ ...doc.data(), id: doc.id })
            });
            setQuestion(questionArray[0].data);
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
                <h1>Current User Marks={currentUser.highscore}</h1>
                <h1>Marks = {score}</h1>
                {question[0] && (
                    <div class="form-group">
                        <label for="exampleInputEmail1">{question[quesIndex].question}</label>
                        {question[quesIndex].options && (
                            question[quesIndex].options.map((e) => (
                                <div class="form-check">
                                    <a onClick={() => handleOptions(e)} href='#'>{e.option}</a>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>


    )
}
