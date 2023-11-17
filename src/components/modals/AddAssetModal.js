/**
 * @AddAssetModal.js
 * @brief
 *
 * Add Asset Modal component. This is used to enter details of new asset.
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
 * 111122 - Creation Date - AJ
 *
 *
 */

import React from "react";
import { useState } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";

export default function AddAssetModal({
  modalShow,
  setModalShow,
  assetAddFn,
  isError,
  setAddAssetError,
}) {
  const [disable, setDisable] = React.useState(false);
  const [assetId, setAssetId] = useState("");
  const [assetDesc, setAssetDesc] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetLocation, setAssetLocation] = useState("");
  const [assetCondition, setAssetCondition] = useState("not_tested");
  const [assetComments, setAssetComments] = useState("");
  const asset = {
    asset_id: assetId,
    asset_desc: assetDesc,
    asset_name: assetName,
    location: assetLocation,
    condition: assetCondition,
    comments: assetComments,
  };

  return (
    <Modal
      show={modalShow}
      onEnter={() => setDisable(false)}
      onHide={() => {
        setModalShow(false);
        setAssetId("");
        setAssetDesc("");
        setAssetName("");
        setAssetComments("");
        setAssetLocation("");
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <b>Asset ID:</b>
          <Form.Control
            type="text"
            placeholder="Asset ID from ERP"
            value={assetId}
            onChange={(e) => {
              setAssetId(e.target.value);
              setAddAssetError(false);
              setDisable(false);
            }}
          />
        </div>
        <div>
          <b>Asset Description:</b>
          <Form.Control
            type="text"
            placeholder="Asset Description from ERP"
            value={assetDesc}
            onChange={(e) => setAssetDesc(e.target.value)}
          />
        </div>
        <div>
          <b>Name:</b>
          <Form.Control
            type="text"
            placeholder="Asset Name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </div>
        <div>
          <b>Condition:</b>
          <select
            class="form-select"
            aria-label="Asset's Condition"
            defaultValue={"not_tested"}
            onChange={(e) => setAssetCondition(e.target.value)}
          >
            <option value="not_tested">not_tested</option>
            <option value="working_good">working_good</option>
            <option value="partially_working">partially_working</option>
            <option value="reworked_working">reworked_working</option>
            <option value="not_working">not_working</option>
            <option value="scrapped">scrapped</option>
          </select>
        </div>
        {/*<div>
          <b>Location:</b>
          <Form.Control
            type="text"
            placeholder="Location"
            value={assetLocation}
            onChange={(e) => setAssetLocation(e.target.value)}
          />
          </div>*/}
        <div>
          <b>Comments:</b>
          <Form.Control
            type="text"
            placeholder="Comments"
            value={assetComments}
            onChange={(e) => setAssetComments(e.target.value)}
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
              assetAddFn(asset);
            }}
          >
            Add Asset
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
