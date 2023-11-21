import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase_config'
import { toast } from 'react-toastify'



export default function Signup() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    var data = [
        {
          "question": "What is the capital of France?",
          "options": [
            {"option": "Paris", "isCorrect": true},
            {"option": "London", "isCorrect": false},
            {"option": "Berlin", "isCorrect": false},
            {"option": "Madrid", "isCorrect": false}
          ]
        },
        {
          "question": "Who painted the Mona Lisa?",
          "options": [
            {"option": "Leonardo da Vinci", "isCorrect": true},
            {"option": "Pablo Picasso", "isCorrect": false},
            {"option": "Vincent van Gogh", "isCorrect": false},
            {"option": "Michelangelo", "isCorrect": false}
          ]
        },
        {
          "question": "What is the largest planet in our solar system?",
          "options": [
            {"option": "Jupiter", "isCorrect": true},
            {"option": "Saturn", "isCorrect": false},
            {"option": "Neptune", "isCorrect": false},
            {"option": "Mars", "isCorrect": false}
          ]
        },
        {
          "question": "Which language is used for web browsers?",
          "options": [
            {"option": "JavaScript", "isCorrect": true},
            {"option": "Python", "isCorrect": false},
            {"option": "Java", "isCorrect": false},
            {"option": "C++", "isCorrect": false}
          ]
        },
        {
          "question": "Who wrote 'Romeo and Juliet'?",
          "options": [
            {"option": "William Shakespeare", "isCorrect": true},
            {"option": "Jane Austen", "isCorrect": false},
            {"option": "Charles Dickens", "isCorrect": false},
            {"option": "Mark Twain", "isCorrect": false}
          ]
        },
        {
          "question": "Which country is known as the 'Land of the Rising Sun'?",
          "options": [
            {"option": "Japan", "isCorrect": true},
            {"option": "China", "isCorrect": false},
            {"option": "South Korea", "isCorrect": false},
            {"option": "Vietnam", "isCorrect": false}
          ]
        },
        {
          "question": "Who discovered the theory of general relativity?",
          "options": [
            {"option": "Albert Einstein", "isCorrect": true},
            {"option": "Isaac Newton", "isCorrect": false},
            {"option": "Galileo Galilei", "isCorrect": false},
            {"option": "Stephen Hawking", "isCorrect": false}
          ]
        },
        {
          "question": "What is the powerhouse of the cell?",
          "options": [
            {"option": "Mitochondria", "isCorrect": true},
            {"option": "Nucleus", "isCorrect": false},
            {"option": "Ribosome", "isCorrect": false},
            {"option": "Endoplasmic reticulum", "isCorrect": false}
          ]
        },
        {
          "question": "Who developed the theory of evolution by natural selection?",
          "options": [
            {"option": "Charles Darwin", "isCorrect": true},
            {"option": "Gregor Mendel", "isCorrect": false},
            {"option": "Louis Pasteur", "isCorrect": false},
            {"option": "Alexander Fleming", "isCorrect": false}
          ]
        },
        {
          "question": "Which ocean is the largest?",
          "options": [
            {"option": "Pacific Ocean", "isCorrect": true},
            {"option": "Atlantic Ocean", "isCorrect": false},
            {"option": "Indian Ocean", "isCorrect": false},
            {"option": "Arctic Ocean", "isCorrect": false}
          ]
        }
    ]
    const { createUser } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await createUser(email, password)
            await addDoc(collection(db,'users'),{
                name: name,
                email:email,
                isAdmin:false,
                groups:'default',
                remarks:'nill',
                highscore:0,
                timeStamp:Timestamp.now(),
            })
            navigate('/account')
        } catch (error) {
            setError(error.message);
            console.log(error.message);
            toast.error(error.code, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }


    return (
        <div>
            <div>
                <p class="h1">Sign UP</p>
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Name</label>
                        <input type="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                            setName(e.target.value)
                        }}
                            value={name} />
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                            value={email} />
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                            value={password} />
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}
