//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import React, { useState } from "react";
import "./login.css";
import dct_logo from "./Assets/DCT-Logo.png";
import Button from "react-bootstrap/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase_config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null)


  const logIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        console.log(userCredentials)
        setUser(userCredentials);
         toast.success('Logged In Sucessfull', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      })
      .catch((error) => {
        setLoginError(error);
        console.log(error);
        toast.error(error.code, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      });
  }

  if (loginError) {

  }


  return (
    <div className="login-main-container">
      <div className="login-l-container"></div>
      <div className="login-r-container">
        <div className="login-placeholder">
          <div className="main-logo">
            <img src={dct_logo} alt="" />
          </div>
          <div className="sub-logo">
            <h2>DATS</h2>
            <h3>DCT Asset Tracking System</h3>
          </div>
          <div></div>
          <div className="login-form">
            <form onSubmit={logIn}>
              <div class="mb-4">
                <label for="exampleInputEmail1" class="form-label">
                  Email Address
                </label>
                <input
                  disabled={false}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                ></input>
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">
                  Password
                </label>
                <input
                  disabled={false}
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                ></input>
                {/* <a href="/">Forgot Password</a> */}
              </div>
              <div class="login-buttton">
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  Login
                </button>
              </div>
              <div className="seperation-container">
                <div className="border"></div>
                <h5> OR </h5>
                <div className="border"></div>
              </div>
              <Button
                variant="secondary"
                class="btn btn-primary"
              >
                SignUp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>













    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Login;
