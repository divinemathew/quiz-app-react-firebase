/**
 * @AssetPage.js
 * @brief
 *
 * Responsible for the HTML Asset Page. Components are called from this page
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
import NavBar from "../../components/navBar/NavBar";
import "./AssetPage.css";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssetDetails from "../../components/assetDetails/AssetDetails";
import AssetLog from "../../components/assetLog/AssetLog";
import DataFetch from "../../hooks/DataFetch";
import ApiConfig from "../../AppConfig.json";

//-----------------------------------------------------------------------------
// AssetPage Function to Return the Asset Page
//-----------------------------------------------------------------------------
function AssetPage({ username, userid, user }) {
  const { asset_id } = useParams();
  const api_assetdetails = ApiConfig.asset_details;
  const { data: asset, error, loading } = DataFetch(api_assetdetails, asset_id);
  const navigate = useNavigate();
  return (
    <div className="asset-container">
      {/* Calling navigation bar component */}
      <NavBar username={username}></NavBar>
      <div className="table-container">
        <div className="top-container">
          <div className="dash-board-name">
            <h3>ASSET HISTORY</h3>
          </div>
          <div className="admin-buttons">
            <button
              class="btn btn-primary dashbutton"
              onClick={() => navigate(-1)}
            >
              BACK
            </button>
          </div>
        </div>
        <div className="table-holder">
          {/* Calling Asset Details Component */}
          <AssetDetails
            asset={asset}
            error={error}
            loading={loading}
            username={userid}
            user={user}
          ></AssetDetails>
          {/* Calling AssetLog Component */}
          {!error && (
            <AssetLog asset={asset} error={error} loading={loading}></AssetLog>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetPage;
