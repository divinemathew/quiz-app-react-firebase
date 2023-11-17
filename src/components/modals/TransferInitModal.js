import React from "react";
import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DataFetch from "../../hooks/DataFetch";

export default function TransferInitModal({
  modalShow,
  setModalShow,
  asset,
  returnFn,
  isError,
  setTransferInitError,
}) {
  const return_user = "inventory.manager";
  const [to_user, setToUser] = useState(return_user);
  const [comments, setComments] = useState("");
  const [disable, setDisable] = React.useState(false);
  const { data: userList } = DataFetch("/", "users");

  return (
    <Modal
      show={modalShow}
      onEnter={() => setDisable(false)}
      onHide={() => {
        setModalShow(false);
        setComments("");
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Transfer {asset.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <b>Asset ID:</b> {asset.asset_id}
        </p>
        <p>
          <b>Description:</b> {asset.erp_desc}
        </p>
        <div>
          <b>Transfer to:</b>
          <div className="dropdown show">
            {userList && (
              <select
                class="form-select"
                aria-label="Transfer to"
                onChange={(e) => {
                  setToUser(e.target.value);
                  setTransferInitError(false);
                  setDisable(false);
                }}
                value={to_user}
              >
                {userList.map((user) => (
                  <option value={user.user_id}>{user.user_id}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div>
          <b>Comments:</b>
          <Form.Control
            type="text"
            placeholder="Any comments while transferring?"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isError && isError.code === "ERR_NETWORK" ? (
          <Button variant="warning" disabled>
            {isError.message}
          </Button>
        ) : isError && isError.code === "ERR_BAD_REQUEST" ? (
          <Button variant="warning" disabled>
            {isError.response.data.message}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={disable}
            onClick={() => {
              setDisable(true);
              returnFn(asset, to_user, comments);
              setComments("");
            }}
          >
            Initiate Transfer
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
