/**
 * @NavBar.js
 * @brief
 *
 * This Component displays the Navigation Bar in UI
 *
 * @props
 *
 * username  - username returned from Microsoft API
 *
 *@return
 *
 *
 * NavBar(Fn) - NavBar Component
 *
 * @note
 *
 * Revision History:
 * 151022 - Creation Date - Divine A Mathew
 *
 *
 */

//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import logo from "./assets/dct_logo.png";
import logout from "./assets/logout.png";
import AppConfig from "../../AppConfig.json";
import "./NavBar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useMsal,
} from "@azure/msal-react";


function NavBar({ username }) {
  const { search_term } = useParams();
  const [searchTerm, setSearchTerm] = useState(search_term);

  const navigate = useNavigate();

  function checkSearchTerm(string) {
    var format = /[!@#$%^&*\\[\]{};':"\\|,<>\/?]+/;
    if (format.test(string)) {
      return true;
    } else {
      return false;
    }
  }

  const handleGlobalSearch = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      if (!checkSearchTerm(e.target.value)) {
        navigate(AppConfig.domain + "/search/" + e.target.value);
        window.location.reload(false);
      } else {
        toast.warn("Please Avoid Special Characters", {
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
  };

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogOut = () => {
    /*const { instance } = useMsal();
    //console.log("nav home id:", accounts[0].username);
    const logoutRequest = {
      account: instance.getAccountByHomeId(accounts[0] && accounts[0].username),
      postLogoutRedirectUri: "https://192.168.5.173/dats/",
    };
    instance.logoutRedirect(logoutRequest);*/

    navigate("/dats/");
  };

  return (
    <div className="App-header">
      <div className="header-container">
        <div className="banner">
          <a href="/dats/dashboard">
            <img src={logo} alt="" />
          </a>
        </div>
        <div className="header-title">
          <a href="/dats/dashboard">
            <h4>DATS</h4>
            <h6>DCT Asset Tracking System</h6>
          </a>
        </div>
      </div>

      <div className="global-search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search Assets Globally"
          aria-label="Search"
          onKeyPress={handleGlobalSearch}
          onChange={handleOnChange}
          value={searchTerm}
        />
      </div>
      <div className="user">
        <Alert variant="primary">
          Signed In As <b>{username.toUpperCase()}</b>
        </Alert>
      </div>
      {/*<div className="logout-button">
        <button onClick={handleLogOut} class="btn btn-primary">
          <img src={logout} alt="logout-icon" />
          Logout
        </button>
  </div>*/}
    </div>
  );
}

export default NavBar;
