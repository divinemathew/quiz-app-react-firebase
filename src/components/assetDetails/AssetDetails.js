/**
 * @AssetDetails.js
 * @brief
 *
 * Asset Details are displayed using this component. This can be used to edit an
 * asset by the user
 *
 * @props
 *
 * asset     - JSON of asset from DB
 * error     - Error while Loading JSON
 * loading   - Loading State of ASYNC Req
 * username  - username returned from Microsoft API
 * user      - User Details From Local DB
 *
 *
 *@return
 *
 *
 * AssetDetails(Fn) - Asset Details Component
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
import "./AssetDetails.css";
import React, { useState } from "react";
import { useEffect } from "react";
import saveIcon from "./Assets/save.png";
import editIcon from "./Assets/edit.png";
import axios from "axios";
import DataFetch from "../../hooks/DataFetch";
import { Modal, Button, Spinner } from "react-bootstrap";
import ApiConfig from "../../AppConfig.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { ReactSession } from 'react-client-session';


//-----------------------------------------------------------------------------
// AssetDetails Function
//-----------------------------------------------------------------------------
function AssetDetails({ asset, error, loading, username, user }) {
  var userToken = ReactSession.get("dats_token") ? ReactSession.get("dats_token") : "";
  var userName = ReactSession.get("dats_user") ? ReactSession.get("dats_user") : "";
  var AuthStr = 'Bearer '.concat(userToken);
  //-----------------------------------------------------------------------------
  // UseState Hooks
  //-----------------------------------------------------------------------------
  const [enableEdit, SetEnableEdit] = useState(true);
  const [enableReassign, setEnableReassign] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [location, setLocation] = useState({ location_room: "", location_name: "" });
  const [projectDescr, setProjectDescr] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [project, setProject] = useState(null);
  const [name, setName] = useState(null);
  const [assetID, setAssetID] = useState(null);
  const [condition, setCondition] = useState(null);
  const [comments, setComments] = useState(null);
  const [saveConfirmModalShow, setSaveConfirmModalShow] = useState(false);
  const [disable, setDisable] = React.useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [isReassign, setIsReassign] = useState(false);
  const [deleteConfirmModalShow, setDeleteConfirmModalShow] = useState(false);
  const [Index, setIndex] = useState(null)

  const no_edit = {
    title: "Failed To Update",
    message: "No Modification In Data",
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"],
    animationOut: ["animate__animated animate__fadeOut"],
  };
  //-----------------------------------------------------------------------------
  // API Data Fetch. [User List and Project List]
  //-----------------------------------------------------------------------------
  const { data: userList } = DataFetch("/", "users");
  const { data: projectList } = DataFetch("/", "projects");
  const { data: locationsFull } = DataFetch("/", "locationsFull");


  const navigate = useNavigate();
  //-----------------------------------------------------------------------------
  // On Click or OnChange Handle Events
  //-----------------------------------------------------------------------------
  const handleEditEvent = () => {
    SetEnableEdit(!enableEdit);
  };
  const handleReassignEvent = () => {
    setEnableReassign(!enableReassign);
  };
  const handleOnchangeLocationRoom = (e) => {
    setIndex(e.target.value);
  };
  const handleOnchangeLocationName = (e) => {
    setLocation({ location_room: locationsFull[Index].location_room, location_name: e.target.value });
  };
  const handleOnchangeDescr = (e) => {
    setProjectDescr(e.target.value.toUpperCase());
  };
  const handleOnchangeAssignee = (e) => {
    setAssignee(e.target.value);
  };
  const handleonChangeProject = (e) => {
    setProject(e.target.value);
  };
  const handleonChangeName = (e) => {
    setName(e.target.value);
  };
  const handleonChangeAssetId = (e) => {
    setAssetID(e.target.value);
  };
  const handleOnchangeCondition = (e) => {
    setCondition(e.target.value);
  };
  const handleOnchangeComments = (e) => {
    setComments(e.target.value);
  };
  const checkEdit = () => {
    if (
      name !== asset[0].name ||
      project !== asset[0].project ||
      projectDescr !== asset[0].erp_desc ||
      location !== asset[0].location ||
      condition !== asset[0].condition ||
      comments !== asset[0].comments
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkReassign = () => {
    if (assignee !== asset[0].assignee) {
      return true;
    } else {
      return false;
    }
  };
  const handleOnclickSave = (e) => {
    if (checkEdit()) {
      setIsSaveError(false);
      setSaveConfirmModalShow(true);
    } else {
      toast.error("Error! No Data Modified", {
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
  };
  const handleOnclickReassign = (e) => {
    if (checkReassign()) {
      setIsReassign(true);
      setIsSaveError(false);
      setSaveConfirmModalShow(true);
    } else {
      toast.error("Error! Assignee Not Changed", {
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
  };
  //HTTP PUT to assets/asset_id
  const handleSaveEvent = () => {
    const ip = ApiConfig.root + ApiConfig.asset_details + asset[0].asset_id;
    SetEnableEdit(!enableEdit);
    var put_data;
    if (isReassign) {
      put_data = {
        req_type: "reassign",
        from: assignee,
        to: user[0].user_id,
        asset_id: asset[0].asset_id,
        erp_desc: projectDescr,
        location: location,
        condition: condition,
        name: name,
        project: project,
        comments: comments,
        assignee: assignee,
      };
    } else if (isAdmin) {
      put_data = {
        req_type: "edit",
        from: assignee,
        to: user[0].user_id,
        asset_id: asset[0].asset_id,
        erp_desc: projectDescr,
        location: location,
        condition: condition,
        name: name,
        project: project,
        assignee: assignee,
        comments: comments,
      };
    } else {
      put_data = {
        req_type: "edit",
        from: user[0].user_id,
        assignee: assignee,
        to: user[0].user_id,
        location: location,
        condition: condition,
        project: project,
        comments: comments,
      };
    }
    axios
      .put(ip, put_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        setSaveConfirmModalShow(false);
        setIsSaveError(false);
        SetEnableEdit(true);
        setEnableReassign(true);
        setIsReassign(false);
        window.location.reload(false);
        //On PUT request success,
      })
      .catch((error) => {
        setIsSaveError(true);
        setIsReassign(false);
        //On PUT request fail,
      });
  };
  function handleDeleteEvent() {
    setDeleteConfirmModalShow(true);
  }
  function deleteItem() {
    const ip = ApiConfig.root + ApiConfig.asset_details + asset[0].asset_id;
    if (asset[0].asset_id) {
      axios
        .delete(ip, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
        .then((response) => {
          setDeleteConfirmModalShow(false);
          setIsSaveError(false);
          SetEnableEdit(true);
          setEnableReassign(true);
          setIsReassign(false);
          navigate(ApiConfig.domain)
          //On PUT request success,
        })
        .catch((error) => {
          setIsSaveError(true);
          setIsReassign(false);
          //On PUT request fail,
        });
    }

  }
  const handleCancelEvent = () => {
    setEnableReassign(true);
    SetEnableEdit(true);
    return false;
  };
  //-----------------------------------------------------------------------------
  // Use Effect Hook [onChangeParams -> asset or user]
  //-----------------------------------------------------------------------------
  useEffect(() => {
    if (asset) {
      setLocation(asset[0].location);
      setProjectDescr(asset[0].erp_desc);
      setAssetID(asset[0].asset_id);
      setName(asset[0].name);
      setProject(asset[0].project);
      setAssignee(asset[0].assignee);
      setCondition(asset[0].condition);
      setComments(asset[0].comments);
    }
    if (user && user[0].user_type === "admin") {
      setIsAdmin(true);
    }
  }, [asset, user]);

  useEffect(() => {
    if (Index) {
      if (locationsFull[Index].location_name.length === 0) {
        setLocation({ location_room: locationsFull[Index].location_room });
      }else {
        setLocation({ location_room: locationsFull[Index].location_room,location_name: "A1" });
      }
    }
  }, [Index]);

  //-----------------------------------------------------------------------------
  // Function Return HTML
  //-----------------------------------------------------------------------------
  return (
    <div className="table-container-holder">
      <div className="table-header grape">
        <h5>ASSET DETAILS</h5>
      </div>
      {/* Pop Up for Confirmation Of the edited details of an Asset  */}
      <Modal
        show={saveConfirmModalShow}
        onEnter={() => setDisable(false)}
        onHide={() => {
          setSaveConfirmModalShow(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to save your edits to the asset details?</p>
        </Modal.Body>
        <Modal.Footer>
          {isSaveError ? (
            <Button variant="warning" disabled>
              Error occurred
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                handleSaveEvent();
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
          <Button
            variant="secondary"
            onClick={() => {
              setSaveConfirmModalShow(false);
            }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deleteConfirmModalShow}
        onEnter={() => setDisable(false)}
        onHide={() => {
          setDeleteConfirmModalShow(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete An Item ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the asset details?</p>
        </Modal.Body>
        <Modal.Footer>
          {isSaveError ? (
            <Button variant="warning" disabled>
              Error occurred
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                deleteItem();
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
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteConfirmModalShow(false);
            }}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {loading && (
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
      )}
      {error && (
        <div class="alert alert-danger" role="alert">
          {error.response.data.message.toUpperCase()}
        </div>
      )}
      {asset && (
        <div className="content-holder">
          <div className="title">
            <div className="sub-title col-form-label">
              <label>Asset#:-</label>
              <input
                defaultValue={asset[0].asset_id}
                value={assetID}
                class="form-control"
                onChange={handleonChangeAssetId}
                maxLength="30"
                disabled={true}
              />
            </div>
            <div className="sub-title">
              <label>Name:-</label>
              <input
                defaultValue={asset[0].name}
                value={name}
                class="form-control"
                onChange={handleonChangeName}
                maxLength="30"
                // disabled={!(!enableEdit && isAdmin)}
                disabled={true}
              />
            </div>
            <div className="sub-title">
              <label>Project:-</label>
              {projectList && (
                <select
                  class="form-select"
                  aria-label="Default select example"
                  disabled={enableEdit}
                  onChange={handleonChangeProject}
                >
                  <option>{asset[0].project}</option>
                  {projectList.map((data) => (
                    <option
                      value={data.project_id}
                      defaultValue={asset[0].project}
                    >
                      {data.project_id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="sub-title">
              <label>Assignee:-</label>
              {userList && (
                <select
                  class="form-select"
                  aria-label="Default select example"
                  disabled={enableReassign}
                  onChange={handleOnchangeAssignee}
                >
                  <option>{asset[0].assignee}</option>
                  {userList.map((user) => (
                    <option
                      value={user.user_id}
                      defaultValue={asset[0].assignee}
                    >
                      {user.user_id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="sub-title">
              <label>Description:-</label>
              <input
                defaultValue={asset[0].erp_desc}
                value={projectDescr}
                // disabled={!(!enableEdit && isAdmin)}
                disabled={true}
                class="form-control"
                onChange={handleOnchangeDescr}
                maxLength="40"
                type="textarea"
              />
            </div>
            <div className="sub-title">
              <label>Location:-</label>
              {locationsFull && (
                <select
                  class="form-select"
                  aria-label="Default select example"
                  disabled={enableEdit}
                  onChange={handleOnchangeLocationRoom}
                >
                  {!Index && <option> {asset[0].location.location_room}{asset[0].location.location_name && <label> | {asset[0].location.location_name}</label>}</option>}
                  {locationsFull.map((data, index) => (
                    <option
                      value={index}
                      defaultValue={asset[0].location.location_room}
                    >
                      {data.location_room}
                    </option>
                  ))}
                </select>
              )}
              {locationsFull && (locationsFull[Index]) && (locationsFull[Index].location_name.length !== 0) && (
                <select
                  class="form-select"
                  aria-label="Default select example"
                  disabled={enableEdit}
                  onChange={handleOnchangeLocationName}
                >
                  {(locationsFull[Index].location_name).map((data) => (
                    <option
                      value={data.name}
                    >
                      {data.name}
                    </option>
                  ))}
                </select>
              )}
              {/* <input
                value={location}
                disabled={enableEdit}
                onChange={handleOnchangeLocation}
                defaultValue={asset[0].location}
                maxLength="30"
                class="form-control"
              /> */}
            </div>
            <div className="sub-title">
              <label>Condition:-</label>
              <select
                class="form-select"
                aria-label="Default select example"
                defaultValue={asset[0].condition}
                disabled={enableEdit}
                onChange={handleOnchangeCondition}
              >
                <option value="not_tested">not_tested</option>
                <option value="working_good">working_good</option>
                <option value="partially_working">partially_working</option>
                <option value="reworked_working">reworked_working</option>
                <option value="not_working">not_working</option>
                <option value="scrapped">scrapped</option>
              </select>
            </div>
            <div className="sub-title">
              <label>Comments:-</label>
              <input
                defaultValue={asset[0].comments}
                value={comments}
                disabled={enableEdit}
                onChange={handleOnchangeComments}
                maxLength="30"
                // defaultValue={asset[0].comments}
                class="form-control"
              />
            </div>
          </div>

          {(username === asset[0].assignee || isAdmin) && (
            <div className="buttons">
              {isAdmin && (
                <div className="delete-button">
                  <button
                    class="btn btn-danger"
                    onClick={handleDeleteEvent}
                    disabled={!enableEdit || !enableReassign}
                  >
                    <img src={editIcon} alt="" />
                    Delete
                  </button>
                </div>
              )}
              {isAdmin && (
                <div className="reassign-button">
                  {enableReassign ? (
                    <button
                      class="btn  edit"
                      onClick={handleReassignEvent}
                      disabled={!enableEdit}
                    >
                      <img src={editIcon} alt="" />
                      Reassign
                    </button>
                  ) : (
                    <button class="btn  save" onClick={handleOnclickReassign}>
                      <img src={saveIcon} alt="" />
                      Save
                    </button>
                  )}
                </div>
              )}
              <div className="edit-button">
                {enableEdit ? (
                  <button
                    class="btn  edit"
                    onClick={handleEditEvent}
                    disabled={!enableReassign}
                  >
                    <img src={editIcon} alt="" />
                    Edit
                  </button>
                ) : (
                  <button class="btn  save" onClick={handleOnclickSave}>
                    <img src={saveIcon} alt="" />
                    Save
                  </button>
                )}
              </div>
              {(!enableReassign || !enableEdit) && (
                <div className="cancel-button">
                  <button class="btn btn-info" onClick={handleCancelEvent}>
                    <img src={editIcon} alt="" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssetDetails;
