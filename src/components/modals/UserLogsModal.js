/**
 * @UserLogsModal.js
 * @brief
 *
 * Modal (POPUP) for showing userlogs
 *
 * @props
 *
 * logModalShow     - Boolean to Set PopUp true
 * setLogModalShow  - UseState Hook to Set logModalShow
 * my_logs          - Logs JSON
 * error            - ASYNC Error for API Request
 * loading          - Loading (Boolean)
 *
 *
 *@return
 *
 *
 * UserLogsModal(Fn) - POPUP for showing Asset Logs
 *
 * @note
 *
 * Revision History:
 * 111122 - Creation Date - Divine A Mathew
 *
 *
 */

//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import React from "react";
import { Button, Modal } from "react-bootstrap";
import UserLogs from "../userLogs/UserLogs";
import ApiConfig from "../../AppConfig.json";
import axios from "axios";
import { ReactSession }  from 'react-client-session';


export default function UserLogsModal({
  logModalShow,
  setLogModalShow,
  my_logs,
  error,
  loading,
  userid,
  old_logs,
  old_logs_error,
  old_logs_loading,
}) {
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 

  const ip = ApiConfig.root;
  const api = ApiConfig.last_accessed;
  const post_data = null;
  const clearUserLogs = () => {
    if (my_logs) {
      axios
        .put(ip + api + userid, post_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
        .then((response) => {
          window.location.reload(false);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };
  return (
    <Modal
      show={logModalShow}
      // onEnter = {() => setDisable(false)}
      onHide={() => {
        setLogModalShow(false);
        clearUserLogs();
      }}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {/* <Modal.Title>User Logs</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <UserLogs
          logs={my_logs}
          error={error}
          loading={loading}
          userid={userid}
          old_logs={old_logs}
          old_logs_error={old_logs_error}
          old_logs_loading={old_logs_loading}
        ></UserLogs>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
