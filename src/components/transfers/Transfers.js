/**
 * @Transfers.js
 * @brief
 *
 * Transfers (Request or Returns) associated with a user is diplayed using this component
 *
 * @props
 *
 * requests  - JSON of requests assigned to the user from DB
 * error     - Error while Loading JSON
 * loading   - Loading State of ASYNC Req
 * username  - username returned from Microsoft API
 * user      - User Details From Local DB
 *
 *
 *@return
 *
 *
 * Transfers(Fn) - Transfers Details Component
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
import "./Transfers.css";
import React, { useState } from "react";
import Paginate from "../paginate/Paginate";
import axios from "axios";
import ConfirmationModal from "../modals/ConfirmationModal";
import TransferAcceptModal from "../modals/TransferAcceptModal";
import actionIcon from "./Assets/Actions.png";
import transferIcon from "./Assets/Transfers.png";
import assetIdIcon from "./Assets/AssetID.png";
import ApiConfig from "../../AppConfig.json";
import { ReactSession }  from 'react-client-session';



//-----------------------------------------------------------------------------
// Trasnfers Component Function
//-----------------------------------------------------------------------------
function Transfers({ requests, error, username, loading, user }) {
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 
  //-----------------------------------------------------------------------------
  // Use State Hooks
  //-----------------------------------------------------------------------------
  const [displayData, setDisplayData] = useState(null);
  const [confirmationModalShow, setConfirmationModalShow] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [transferAcceptModalShow, setTransferAcceptModalShow] = useState(false);
  const [transferAcceptError, setTransferAcceptError] = useState(false);
  const [activeRequest, setActiveRequest] = useState({});

  const ip = ApiConfig.root; //root of the ip

  //-----------------------------------------------------------------------------
  // onClick or OnChange Event Handlers
  //-----------------------------------------------------------------------------
  const handleConfirmation = (request, action) => {
    var api_to_use,
      post_data = {
        // req_type: request.req_type,
        // asset_id: request.asset_id,
        // from: request.from,
        // to: request.to,
        id: request.id,
        asset_id: request.asset_id,
      };
    if (action === "accept") api_to_use = ApiConfig.accept;
    else if (action === "decline") api_to_use = ApiConfig.reject;
    else if (action === "cancel") api_to_use = ApiConfig.cancel;
    else {
      setConfirmError(true);
      return;
    }
    //POST this request for accepting item
    axios
      .post(ip + api_to_use, post_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setConfirmationModalShow(false);
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setConfirmError(error);
      });
  };


  var err = {
    code: "",
    message: "",
  };
  const handleTransferAccept = (request, project, location) => {
    if (location.location_room !== "") {
      if ((location.location_room === "Design Center C1" && !location.location_name) ||
        (location.location_room === "Design Center C2" && !location.location_name) ||
        (location.location_room === "Design Center U1" && !location.location_name)) {
        err.code = "ERR_NETWORK";
        err.message = "Location Name Cannot Be Empty";
        setTransferAcceptError(err);
      }
      else {
        var post_data = {
          // req_type: request.req_type,
          // asset_id: request.asset_id,
          // from: request.from,
          // to: request.to,
          project: project,
          location: location,
          id: request.id,
          asset_id: request.asset_id,
        };
        //POST this request for accepting item
        axios
          .post(ip + ApiConfig.accept, post_data, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
          .then((response) => {
            //On POST request success,
            setTransferAcceptModalShow(false);
            window.location.reload(false);
          })
          .catch((error) => {
            //On POST request fail,
            setTransferAcceptError(error);
          });
      }
    }
    else {
      err.code = "ERR_NETWORK";
      err.message = "Location Cannot Be Empty";
      setTransferAcceptError(err);
    }
  };

  return (
    <div className="table-container-holder">
      <div className="table-header grape">
        <h5>TRANSFERS</h5>
      </div>
      <ConfirmationModal
        modalShow={confirmationModalShow}
        setModalShow={setConfirmationModalShow}
        request={activeRequest}
        action={confirmAction}
        confirmFn={handleConfirmation}
        isError={confirmError}
      />

      <TransferAcceptModal
        modalShow={transferAcceptModalShow}
        setModalShow={setTransferAcceptModalShow}
        request={activeRequest}
        transferFn={handleTransferAccept}
        isError={transferAcceptError}
        setTransferAcceptError={setTransferAcceptError}
      />

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">
              <img src={assetIdIcon} alt="" />
              Asset ID/Name
            </th>
            <th scope="col">
              <img src={transferIcon} alt="" />
              Transfer
            </th>
            <th scope="col">
              <img src={actionIcon} alt="" />
              User Actions
            </th>
            {user && user[0].user_type === "admin" && (
              <th scope="col">
                <img src={actionIcon} alt="" />
                Admin Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>
          )}
          {error && error.code === "ERR_NETWORK" && (
            <div class="alert alert-danger" role="alert">
              {error.message.toUpperCase()}
            </div>
          )}
          {error && error.code === "ERR_BAD_REQUEST" && (
            <div class="alert alert-danger" role="alert">
              {error.response.data.message.toUpperCase()}
            </div>
          )}
          {displayData &&
            displayData.map((request) => (
              <tr>
                <td>
                  <div className="asset-name">
                    <div className="asset-title">
                      <a href={`${ApiConfig.domain}/asset/${request.asset_id}`}>
                        {request.asset_id}
                      </a>
                    </div>
                    <div className="asset-sub">{request.name}</div>
                  </div>
                </td>
                {request.from === username &&
                  request.req_type === "transfer" && (
                    <td>Transfer to {request.to}</td>
                  )}
                {request.from === username && request.req_type === "transfer" && (
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        setConfirmAction("cancel");
                        setActiveRequest(request);
                        setConfirmError(false);
                        setConfirmationModalShow(true);
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                )}
                {request.from === username &&
                  request.req_type === "request" && (
                    <td>Request to {request.to} </td>
                  )}
                {request.from === username && request.req_type === "request" && (
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        setConfirmAction("cancel");
                        setActiveRequest(request);
                        setConfirmError(false);
                        setConfirmationModalShow(true);
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                )}
                {request.to === username && request.req_type === "transfer" && (
                  <td>Transfer From {request.from}</td>
                )}
                {request.to === username && request.req_type === "transfer" && (
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setActiveRequest(request);
                        setTransferAcceptError(false);
                        setTransferAcceptModalShow(true);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setConfirmAction("decline");
                        setActiveRequest(request);
                        setConfirmError(false);
                        setConfirmationModalShow(true);
                      }}
                    >
                      Decline
                    </button>
                  </td>
                )}
                {request.to === username && request.req_type === "request" && (
                  <td>Requested By {request.from}</td>
                )}
                {request.to === username && request.req_type === "request" && (
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setConfirmAction("accept");
                        setActiveRequest(request);
                        setConfirmError(false);
                        setConfirmationModalShow(true);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setConfirmAction("decline");
                        setActiveRequest(request);
                        setConfirmError(false);
                        setConfirmationModalShow(true);
                      }}
                    >
                      Decline
                    </button>
                  </td>
                )}
                {user &&
                  user[0].user_type === "admin" &&
                  request.to === "inventory.manager" &&
                  request.req_type !== "request" &&
                  request.from !== username && (
                    <td>
                      Transfer from {request.from} to {request.to}
                    </td>
                  )}
                {user &&
                  user[0].user_type === "admin" &&
                  request.to === "inventory.manager" &&
                  request.req_type === "request" &&
                  request.from !== username && (
                    <td>
                      Requested by {request.from} to {request.to}
                    </td>
                  )}
                {user &&
                  user[0].user_type === "admin" &&
                  request.to === "inventory.manager" &&
                  request.from !== username && <td>NA</td>}
                {user &&
                  user[0].user_type === "admin" &&
                  request.to === "inventory.manager" &&
                  request.req_type !== "request" && (
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setActiveRequest(request);
                          setTransferAcceptError(false);
                          setTransferAcceptModalShow(true);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setConfirmAction("decline");
                          setActiveRequest(request);
                          setConfirmError(false);
                          setConfirmationModalShow(true);
                        }}
                      >
                        Decline
                      </button>
                    </td>
                  )}
                {user &&
                  user[0].user_type === "admin" &&
                  request.to === "inventory.manager" &&
                  request.req_type === "request" && (
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setConfirmAction("accept");
                          setActiveRequest(request);
                          setConfirmError(false);
                          setConfirmationModalShow(true);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setConfirmAction("decline");
                          setActiveRequest(request);
                          setConfirmError(false);
                          setConfirmationModalShow(true);
                        }}
                      >
                        Decline
                      </button>
                    </td>
                  )}
              </tr>
            ))}
        </tbody>
      </table>
      {requests && (
        <Paginate
          setDisplayData={(data) => setDisplayData(data)}
          assets={requests}
          user={user}
        ></Paginate>
      )}
    </div>
  );
}

export default Transfers;
