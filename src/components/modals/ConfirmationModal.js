import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

export default function ConfirmationModal({
  modalShow,
  setModalShow,
  request,
  action,
  confirmFn,
  isError,
}) {
  const [disable, setDisable] = React.useState(false);

  function confirmationMessage() {
    return (
      "Are you sure you want to " +
      action +
      " the " +
      request.req_type +
      " of asset " +
      request.asset_id +
      "?"
    );
  }

  return (
    <Modal
      show={modalShow}
      onEnter={() => setDisable(false)}
      onHide={() => {
        setModalShow(false);
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{confirmationMessage()}</p>
      </Modal.Body>
      <Modal.Footer>
        {isError && isError.code === "ERR_NETWORK" ? (
          <Button variant="warning" disabled>
            {isError.message}
          </Button>
        ) : isError && isError.code === "ERR_BAD_REQUEST" ? (
            <Button variant="warning" disabled>
              {isError.message}
            </Button>
          ): (
          <Button
            variant="primary"
            disabled={disable}
            onClick={() => {
              setDisable(true);
              confirmFn(request, action);
            }}
          >
            Yes
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
