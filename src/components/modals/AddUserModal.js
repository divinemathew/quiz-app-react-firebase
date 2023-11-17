/**
 * @AddUserModal.js
 * @brief
 *
 * Add User Modal component. This is used to enter details of new user.
 *
 * @props
 *
 * modalShow     - Boolean to show/hide the modal
 * setModalShow  - Function to set the value of 'modalShow'
 * assetAddFn    - Function to handle the adding of asset
 * isError       - Condition of adding asset (status of 'assetAddFn')
 *
 *
 * @return
 *
 * AddAssetModal(Fn) - Add Asset Modal Component
 *
 * @note
 *
 * Revision History:
 * 071222 - Creation Date - Divine A Mathew
 *
 *
 */

import React from "react";
import { useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";

export default function AddUserModal({
  modalShow,
  setModalShow,
  userAddFn,
  isError,
  setAddUserError,
}) {
  const [disable, setDisable] = React.useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("normal");
  const [userRemarks, setUserRemarks] = useState("");

  const user = {
    user_id: userId,
    user_name: userName,
    user_email: userEmail,
    user_type: userType,
    user_remarks: userRemarks,
  };

  return (
    <Modal
      show={modalShow}
      onEnter={() => setDisable(false)}
      onHide={() => {
        setModalShow(false);
        setUserId(null);
        setUserName("");
        setUserEmail("");
        setUserType("normal");
        setUserRemarks("");
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <b>*User ID:</b>
          <Form.Control
            type="text"
            placeholder="User ID to be added in DB"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setAddUserError(false);
              setDisable(false);
            }}
            required
          />
        </div>
        <div>
          <b>*User Name:</b>
          <Form.Control
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setAddUserError(false);
              setDisable(false);
            }}
          />
        </div>
        <div>
          <b>*User Email:</b>
          <Form.Control
            type="text"
            placeholder="User Email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              setAddUserError(false);
              setDisable(false);
            }}
          />
        </div>
        <div>
          <b>*User Type:</b>
          <select
            class="form-select"
            aria-label="User Privilage"
            defaultValue={"normal"}
            onChange={(e) => {
              setUserType(e.target.value);
              setAddUserError(false);
              setDisable(false);
            }}
          >
            <option value="normal">normal</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <b>*User Remarks:</b>
          <Form.Control
            required
            type="text"
            placeholder="Location"
            value={userRemarks}
            onChange={(e) => {
              setUserRemarks(e.target.value);
              setAddUserError(false);
              setDisable(false);
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isError && isError.code === "ERR_NETWORK" ? (
          <Button variant="warning" disabled>
            {isError.message}
          </Button>
        ) : isError && isError.code === "ERR_BAD_RESPONSE" ? (
          <Button variant="warning" disabled>
            {isError.response.data.message}
          </Button>
        ) : (
          <Button
            className="btn btn-success"
            disabled={disable}
            onClick={() => {
              setDisable(true);
              userAddFn(user);
            }}
          >
            Add User
            {disable ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              ""
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
