/**
 * @MyAssets.js
 * @brief
 *
 * Assets assigned to the user are displayed using this component
 *
 * @props
 *
 * asset     - JSON of asset from DB
 * error     - Error while Loading JSON
 * loading   - Loading State of ASYNC Req
 * username  - username returned from Microsoft API
 *
 *
 *@return
 *
 *
 * MyAssets(Fn) - Return the assets assigned to user
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
import "./MyAssets.css";
import React from "react";
import { useState } from "react";
import TransferInitModal from "../modals/TransferInitModal";
import Paginate from "../paginate/Paginate";
import axios from "axios";
import assetIdIcon from "./Assets/AssetID.png";
import locationIcon from "./Assets/location.png";
import actionIcon from "./Assets/Actions.png";
import ApiConfig from "../../AppConfig.json";
import { ReactSession }  from 'react-client-session';



//-----------------------------------------------------------------------------
// My Assets Function
//-----------------------------------------------------------------------------
function MyAssets({ username, assets, error, loading }) {
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : ""; 
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : ""; 
  var AuthStr = 'Bearer '.concat(userToken); 
  //-----------------------------------------------------------------------------
  // All UseState Hook Declaration
  //-----------------------------------------------------------------------------
  const [displayData, setDisplayData] = useState(null);
  const [assetInTransaction, setAssetInTransaction] = useState({});
  const [TransferInitModalShow, setTransferInitModalShow] = useState(false);
  const [TransferInitError, setTransferInitError] = useState(false);

  //-----------------------------------------------------------------------------
  // API Details
  //-----------------------------------------------------------------------------
  const ip = ApiConfig.root + ApiConfig.request;

  //-----------------------------------------------------------------------------
  // onClick or onChange Event Handlers
  //-----------------------------------------------------------------------------
  var err = {
    code: "",
    message: "",
  };

  const handleTransfer = (asset, to_user, comments) => {
    if (to_user === username) {
      err.code = "ERR_NETWORK";
      err.message = "Cannot Transfer An Item To It's Assignee";
      setTransferInitError(err);
      return false;
    }
    var req = {
      req_type: "transfer",
      asset_id: asset.asset_id,
      name: asset.name,
      from: username,
      to: to_user,
      comments: comments,
    };

    // POST this request for returning item
    axios
      .post(ip, req, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
      .then((response) => {
        //On POST request success,
        setTransferInitModalShow(false);
        window.location.reload(false);
      })
      .catch((error) => {
        //On POST request fail,
        setTransferInitError(error);
      });
  };

  return (
    <div className="table-container-holder">
      <div className="table-header green">
        <h5>MY ASSETS</h5>
      </div>
      <TransferInitModal
        modalShow={TransferInitModalShow}
        setModalShow={setTransferInitModalShow}
        setTransferInitError={setTransferInitError}
        asset={assetInTransaction}
        returnFn={handleTransfer}
        isReturn={true}
        isError={TransferInitError}
      />
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">
              <img src={assetIdIcon} alt="" />
              Asset ID/Name
            </th>
            <th scope="col">
              <img src={locationIcon} alt="" />
              Condition/Location
            </th>
            <th scope="col">
              <img src={actionIcon} alt="" />
              Action
            </th>
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
            displayData.map((asset) => (
              <tr>
                <td>
                  <div className="asset-name">
                    {asset.asset_id && (
                      <div className="asset-title">
                        <a href={`${ApiConfig.domain}/asset/${asset.asset_id}`}>
                          {asset.asset_id}
                        </a>
                      </div>
                    )}
                    {asset.name && (
                      <div className="asset-sub">
                        {asset.name.substring(0, 50).toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {asset.condition}{" "}
                  <div className="asset-sub">
                    {asset.location.location_room && !asset.location.location_name && <p>{asset.location.location_room}</p>}
                    {asset.location.location_room && asset.location.location_name && <p>{asset.location.location_room}:{asset.location.location_name} </p>}
                    {!asset.location.location_room && <p>Location Unavailable</p>}
                  </div>{" "}
                </td>
                <td>
                  {asset.assignee !== "inventory.manager" && (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setAssetInTransaction(asset);
                        setTransferInitModalShow(true);
                        setTransferInitError(false);
                      }}
                    >
                      Transfer
                    </button>
                  )}
                  {asset.assignee === "inventory.manager" && (
                    <div className="asset-title">
                      {asset.assignee.toUpperCase()}
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {assets && (
        <Paginate
          setDisplayData={(data) => setDisplayData(data)}
          assets={assets}
        ></Paginate>
      )}
    </div>
  );
}

export default MyAssets;
