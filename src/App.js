import { useEffect } from 'react';
import './App.css';
// import Login from './components/Login';
// import SignUp from './components/SignUp';

import Login from './pages/loginScreen/Login';
import { db } from './firebase_config';


import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './comp/Signin';
import Signup from './comp/Signup';
import { AuthContextProvider } from './context/AuthContext';
import Account from './comp/Account';
import Dashboard from './pages/dashBoard/DashBoard'
import ProtectedRoute from './comp/ProtectedRoute';






function App() {
  const userCollection = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollection)
      console.log(data);
      const docsRef = data.docs.map((doc) => ({
        ...doc.data(), id: doc.id
      }))
      console.log(docsRef);
    }

    getUsers();
  })


  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path='/' element={<Signin></Signin>}></Route>
            <Route path='/signup' element={<Signup></Signup>}></Route>
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}></Route>
          </Routes>
        </AuthContextProvider>
        <ToastContainer></ToastContainer>
      </BrowserRouter>
    </div>
  );
}

export default App;
