/**
 * @DashBoard.js
 * @brief
 *
 * Responsible for the HTML Dashboard Page. All Components are called from this page
 *
 * @props
 *
 * userid   - UserID of the user
 * username - username returned from Microsoft API
 * user     - User Details From Local DB
 *
 *
 *@return
 *
 *
 * DashBoard(Fn) - DashBoard HTML Page Component
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
import NavBar from "../../components/navBar/NavBar";
import "./DashBoard.css";
import DataFetch from "../../hooks/DataFetch";
import MyAssets from "../../components/myAssets/MyAssets";
import Transfers from "../../components/transfers/Transfers";
import { useMsal } from "@azure/msal-react";
import AddAssetModal from "../../components/modals/AddAssetModal";
import axios from "axios";
import UserLogsModal from "../../components/modals/UserLogsModal";
import ApiConfig from "../../AppConfig.json";
import AddUserModal from "../../components/modals/AddUserModal";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUserModal from "../../components/modals/EditUserModal";
import { ReactSession }  from 'react-client-session';

//-----------------------------------------------------------------------------
// DashBoard Function
//-----------------------------------------------------------------------------
function DashBoard({ username, userid, user }) {
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 
  
  if(!userToken || !userName || userToken === "" || userName === "" ) {
  window.location.reload(false);    
  }
  // Username Checking
  if (
    !username ||
    username === "undefined" ||
    username === "" ||
    username === null
  ) {
    const { instance, accounts } = useMsal();
    username = accounts[0] && accounts[0].name;
    const id = accounts[0] && accounts[0].username.split("@");
    userid = id[0];
  }

  // Api Configuration Calling
  const ip = ApiConfig.root;
  const api_trans = ApiConfig.my_request;
  const api_assets = ApiConfig.my_assets;
  const api_latest_logs = ApiConfig.latest_logs;
  const api_asset = ApiConfig.asset_details;
  const api_old_logs = ApiConfig.logs;
  const asset_init_assignee = "inventory.manager";
  const api_users = ApiConfig.users;

  // Api GET Request
  const {
    data: my_assetsJson,
    error: assets_error,
    loading: asset_loading,
  } = DataFetch(api_assets, userid);

  const {
    data: my_transfersJson,
    error: transfer_error,
    loading: transfer_loading,
  } = DataFetch(api_trans, userid);

  const { data: my_logs, error: logs_error, loading: logs_loading } = DataFetch(
    api_latest_logs,
    userid
  );
  const {
    data: old_logs,
    error: old_logs_error,
    loading: old_logs_loading,
  } = DataFetch(api_old_logs, userid);

  var err = {
    code: "",
    message: "",
  };
  //-----------------------------------------------------------------------------
  // UseState Hooks
  //-----------------------------------------------------------------------------
  const handleShow = () => setShow(true);
  const [my_assets, SetMyAssets] = useState("");
  const [my_transfers, SetMyTransfers] = useState("");
  const [searchTerm, SetSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [logModalShow, setLogModalShow] = useState(false);
  const [addAssetModalShow, setAddAssetModalShow] = useState(false);
  const [addAssetError, setAddAssetError] = useState(false);
  const [addUserError, setAddUserError] = useState(false);
  const [addUserModalShow, setAddUserModalShow] = useState(false);
  const [editUserError, setEditUserError] = useState(false);
  const [editUserModalShow, setEditUserModalShow] = useState(false);
  const [userList, setUserList] = useState(false);
  const [index, setIndex] = useState(null);
  //-----------------------------------------------------------------------------
  // OnChange or OnClick Event Handlers
  //-----------------------------------------------------------------------------
  useEffect(() => {
    handleSearchEvent();
  }, [searchTerm]);

  function handleSearchEvent() {
    if (searchTerm !== "") {
      if (my_assetsJson && my_transfersJson) {
        const assets_filter = my_assetsJson.filter((my_assetsJson) => {
          return Object.values(my_assetsJson)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        const transfers_filter = my_transfersJson.filter((my_transfersJson) => {
          return Object.values(my_transfersJson)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        SetMyAssets(assets_filter);
        SetMyTransfers(transfers_filter);
      } else if (my_assetsJson) {
        const assets_filter = my_assetsJson.filter((my_assetsJson) => {
          return Object.values(my_assetsJson)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        SetMyAssets(assets_filter);
      } else if (my_transfersJson) {
        const transfers_filter = my_transfersJson.filter((my_transfersJson) => {
          return Object.values(my_transfersJson)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        SetMyTransfers(transfers_filter);
      }
    } else {
      SetMyAssets(my_assetsJson);
      SetMyTransfers(my_transfersJson);
    }
  }

  function containsWhitespace(str) {
    return /\s/.test(str);
  }

  const handleAddAsset = (asset) => {
    if (asset.asset_id) {
      if (containsWhitespace(asset.asset_id)) {
        err.code = "ERR_NETWORK";
        err.message = "Asset Id Cannot Contain WhiteSpace";
        setAddAssetError(err);
        return false;
      }
    } else {
      err.code = "ERR_NETWORK";
      err.message = "Asset Id Cannot Be Blank";
      setAddAssetError(err);
      return false;
    }
    var post_data = {
      asset_id: asset.asset_id,
      name: asset.asset_name,
      en_no: "",
      erp_desc: asset.asset_desc,
      location: {"location_room": "DATS Store", "location_name": ""}, //asset.location,
      project: null,
      assignee: asset_init_assignee,
      condition: asset.condition,
      user: userid,
      comments: asset.comments,
    };

    axios
      .post(ip + api_asset, post_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setAddAssetModalShow(false);
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setAddAssetError(error);
      });
  };

  const handleAddUser = (user) => {
    if (user.user_id) {
      if (containsWhitespace(user.user_id)) {
        err.code = "ERR_NETWORK";
        err.message = "User Id Cannot Contain WhiteSpace";
        setAddUserError(err);
        return false;
      }
    } else {
      err.code = "ERR_NETWORK";
      err.message = "User ID Cannot be Blank";
      setAddUserError(err);
      return false;
    }
    if (!user.user_name) {
      err.code = "ERR_NETWORK";
      err.message = "User Name Cannot be Blank";
      setAddUserError(err);
      return false;
    }
    if (!user.user_email) {
      err.code = "ERR_NETWORK";
      err.message = "User Email Cannot be Blank";
      setAddUserError(err);
      return false;
    }
    if (!user.user_type) {
      err.code = "ERR_NETWORK";
      err.message = "User Type Cannot be Blank";
      setAddUserError(err);
      return false;
    }
    var post_data = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_type: user.user_type,
      user_remarks: user.user_remarks,
    };

    axios
      .post(ip + api_users, post_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setAddUserModalShow(false);
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setAddUserError(error);
      });
  };

  const handleUserLogs = () => {
    setLogModalShow(!logModalShow);
  };

  function handleEditUser() {
    axios
      .get(ip + api_users, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On GET request success,
        setUserList(response.data);
        setEditUserModalShow(true);
      })
      .catch((error) => {
        //On GET request fail,
        toast.error("Unable To Load User Data", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }

  function handleSaveUser(user) {
    if (user.user_id !== userList[index].user_id) {
      err.code = "ERR_NETWORK";
      err.message = "Invalid User ID";
      setEditUserError(err);
      return false;
    }
    if (
      user.user_name === userList[index].user_name &&
      user.user_type === userList[index].user_type &&
      user.user_email === userList[index].user_email &&
      user.user_remarks === userList[index].user_remarks
    ) {
      err.code = "ERR_NETWORK";
      err.message = "No Change Detected";
      setEditUserError(err);
      return false;
    }
    var put_data = {
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_type: user.user_type,
      user_remarks: user.user_remarks,
    };

    axios
      .put(ip + api_users + user.user_id, put_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setEditUserModalShow(false)
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setEditUserError(error);
      });
  }

  function handleDeleteUser(user_ID) {
    if(user_ID){
      axios
      .delete(ip + api_users + user_ID,  { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setEditUserModalShow(false)
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setEditUserError(error);
      });
    }
  }
  return (
    <div className="dashboard-container">
      {/* Pop Up for Add Asset */}
      <AddAssetModal
        modalShow={addAssetModalShow}
        setModalShow={setAddAssetModalShow}
        assetAddFn={handleAddAsset}
        isError={addAssetError}
        setAddAssetError={setAddAssetError}
      />
      <AddUserModal
        modalShow={addUserModalShow}
        setModalShow={setAddUserModalShow}
        userAddFn={handleAddUser}
        isError={addUserError}
        setAddUserError={setAddUserError}
      />
      <EditUserModal
        modalShow={editUserModalShow}
        setModalShow={setEditUserModalShow}
        userEditFn={handleSaveUser}
        userDeleteFn={handleDeleteUser}
        isError={editUserError}
        setEditUserError={setEditUserError}
        userList={userList}
        index={index}
        setIndex={setIndex}
      />
      {/* Pop Up for User Log */}
      <UserLogsModal
        logModalShow={logModalShow}
        my_logs={my_logs}
        setLogModalShow={(data) => setLogModalShow(data)}
        error={logs_error}
        loading={logs_loading}
        userid={userid}
        old_logs={old_logs}
        old_logs_error={old_logs_error}
        old_logs_loading={old_logs_loading}
      ></UserLogsModal>
      {/* Calling NavigationBar Component */}
      <NavBar username={username}></NavBar>
      <div className="table-container">
        <div className="top-container">
          <div className="dash-board-name">
            <h3>DASHBOARD</h3>
          </div>
          <div className="notification-button">
            <button type="button" class="icon-button" onClick={handleUserLogs}>
              <span class="material-icons">notifications</span>
              {my_logs && (
                <span class="icon-button__badge">{my_logs.length}</span>
              )}
            </button>
          </div>
          {user && user[0].user_type === "admin" && (
            <div className="admin-buttons">
              <button
                class="btn btn-primary dashbutton"
                onClick={() => {
                  setAddAssetError(false);
                  setAddAssetModalShow(true);
                }}
              >
                ADD ITEM
              </button>
              {/* <button
                class="btn btn-primary dashbutton"
                onClick={() => {
                  setAddUserError(false);
                  setAddUserModalShow(true);
                }}
              >
                {" "}
                ADD USER
              </button> */}
              <button
                class="btn btn-primary dashbutton"
                onClick={handleEditUser}
              >
                {" "}
                EDIT USER
              </button>
            </div>
          )}
        </div>
        <div className="dashboard-display-data">
          <div className="search-container">
            <div className="search">
              <label htmlFor="">Filter</label>
              <input
                class="form-control me-2"
                type="search"
                placeholder="Filter by Asset,Assignee,etc"
                aria-label="Search"
                onChange={(e) => {
                  SetSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="table-holder">
            {/* Calling MyAssets Component */}
            <MyAssets
              username={userid}
              error={assets_error}
              assets={searchTerm < 1 ? my_assetsJson : my_assets}
              loading={asset_loading}
            ></MyAssets>
            {/* Calling Transfers Component */}
            <Transfers
              username={userid}
              error={transfer_error}
              requests={searchTerm < 1 ? my_transfersJson : my_transfers}
              loading={transfer_loading}
              user={user}
            ></Transfers>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
