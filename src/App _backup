import { useEffect } from 'react';
import './App.css';
// import Login from './components/Login';
// import SignUp from './components/SignUp';

import Login from './pages/loginScreen/Login';
import { db } from './firebase_config';


import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from 'react-toastify';






function App() {
  const userCollection = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollection)
      console.log(data);
      const docsRef = data.docs.map((doc)=>({
        ...doc.data(),id:doc.id
      }))
      console.log(docsRef);
    }

    getUsers();
  })
  return (
    <div>
     {/* <SignUp></SignUp> */}
      <Login></Login> 
    {/* <Login></Login> */}
    <ToastContainer />
    </div>
  );
}

export default App;
