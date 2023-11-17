/**
 * @EditUserModal.js
 * @brief
 *
 * Edit User Modal component. This is used to edit details of a user.
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
 * EditUserModal(Fn) - edit User Component
 *
 * @note
 *
 * Revision History:
 * 121222 - Creation Date - Divine A Mathew
 *
 *
 */

import React from "react";
import { useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { useEffect } from "react";

export default function EditUserModal({
  modalShow,
  setModalShow,
  userEditFn,
  userDeleteFn,
  isError,
  setEditUserError,
  userList,
  index,
  setIndex,
}) {
  const [disable, setDisable] = React.useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userType, setUserType] = useState("normal");
  const [userRemarks, setUserRemarks] = useState(null);
  const user = {
    user_id: userId,
    user_name: userName,
    user_email: userEmail,
    user_type: userType,
    user_remarks: userRemarks,
  };

  useEffect(() => {
    if (userList && index) {
      setUserId(userList[index].user_id);
      setUserName(userList[index].user_name);
      setUserEmail(userList[index].user_email);
      setUserType(userList[index].user_type);
      setUserRemarks(userList[index].user_remarks);
    }
  }, [index]);

  return (
    <Modal
      show={modalShow}
      onEnter={() => setDisable(false)}
      onHide={() => {
        setModalShow(false);
        setUserId(null);
        setUserName("");
        setUserEmail("");
        setUserRemarks("");
        setIndex(null);
        setEditUserError(false);
        setDisable(false);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <b>*User ID:</b>
          <select
            class="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              setIndex(e.target.value);
              setEditUserError(false);
              setDisable(false);
            }}
          >
            {!index && <option value={false}>select user</option>}
            {userList &&
              userList.map((user, index) => (
                <option value={index}>{user.user_id}</option>
              ))}
          </select>
        </div>
        {index && userList[index] && (
          <div className="user-details">
            <div>
              <b>*User Name:</b>
              <Form.Control
                type="text"
                placeholder="User Name"
                defaultValue={userList[index].user_name}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setEditUserError(false);
                  setDisable(false);
                }}
                disabled={true}
              />
            </div>
            <div>
              <b>*User Email:</b>
              <Form.Control
                type="text"
                placeholder="User Email"
                value={userEmail}
                defaultValue={userList[index].user_email}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setEditUserError(false);
                  setDisable(false);
                }}
                disabled={true}
              />
            </div>
            <div>
              <b>*User Type:</b>
              <select
                class="form-select"
                aria-label="User Privilage"
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setEditUserError(false);
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
                defaultValue={userList[index].user_remarks}
                value={userRemarks}
                onChange={(e) => {
                  setUserRemarks(e.target.value);
                  setEditUserError(false);
                  setDisable(false);
                }}
                disabled={false}
              />
            </div>
          </div>
        )}
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
            className="btn btn-danger"
            disabled={disable || !index}
            onClick={() => {
              setDisable(true);
              userDeleteFn(user.user_id);
            }}
          >
            Delete User
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
            disabled={disable || !index}
            onClick={() => {
              setDisable(true);
              userEditFn(user);
            }}
          >
            Save User
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
