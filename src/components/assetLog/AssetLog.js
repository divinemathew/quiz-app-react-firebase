/**
 * @AssetLog.js
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
 *
 *
 *@return
 *
 *
 * AssetLog(Fn) - Asset Log Component
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
import React from "react";
import "./AssetLog.css";
import "../myAssets/MyAssets.css";

//-----------------------------------------------------------------------------
// Asset Log Function
//-----------------------------------------------------------------------------
function AssetLog({ asset, error, loading }) {
  //-----------------------------------------------------------------------------
  // Render HTML
  //-----------------------------------------------------------------------------
  return (
    <div className="table-container-holder">
      <div className="table-header green">
        <h5>ASSET HISTORY LOG </h5>
      </div>
      <div className="my-custom-scroll">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Assignee</th>
              <th scope="col">Condition / Project</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading State Handling of Async API Request */}
            {loading && (
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              </div>
            )}
            {/* Error State handling of Async API Request */}
            {error && (
              <div class="alert alert-danger" role="alert">
                {error.data.message.toUpperCase()}
              </div>
            )}
            {asset &&
              asset[0].logs.map((log) => (
                <tr>
                  <td>
                    {log.action === "create" && (
                      <div className="asset-name">
                        <div className="asset-title">
                          Asset Created By {log.user.toUpperCase()}
                        </div>
                        <div className="asset-sub">
                        <div>Comments : {log.comments}</div>
                          {new Date(log.datetime).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "short",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    )}
                    {log.action === "request" && (
                      <div className="asset-name">
                        <div className="asset-title">
                          Requested By {log.assignee.toUpperCase()}
                        </div>
                        <div className="asset-sub">
                          <div>Comments : {log.comments}</div>
                          <div>
                            {new Date(log.datetime).toLocaleString("en-GB", {
                              dateStyle: "short",
                              timeStyle: "short",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {log.action === "reassign" && (
                      <div className="asset-name">
                        {log.assignee && (
                          <div className="asset-title">
                            Assigned to {log.assignee.toUpperCase()} by{" "}
                            {log.user}
                          </div>
                        )}
                        <div className="asset-sub">
                          <div>
                            {new Date(log.datetime).toLocaleString("en-GB", {
                              dateStyle: "short",
                              timeStyle: "short",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {log.action === "edit" && (
                      <div className="asset-name">
                        <div className="asset-title">
                          Edited by {log.user.toUpperCase()}
                        </div>
                        <div className="asset-sub">
                          <div>Comments : {log.comments}</div>
                          <div>
                            {new Date(log.datetime).toLocaleString("en-GB", {
                              dateStyle: "short",
                              timeStyle: "short",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {log.action === "transfer" && (
                      <div className="asset-name">
                        <div className="asset-title">
                          Transferred to {log.assignee.toUpperCase()}
                        </div>
                        <div className="asset-sub">
                          <div>Comments : {log.comments}</div>
                          <div>
                            {new Date(log.datetime).toLocaleString("en-GB", {
                              dateStyle: "short",
                              timeStyle: "short",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="condition-location">
                      <div>{log.condition}</div>
                      <div>{log.project}</div>
                    </div>
                  </td>
                  <td>
                    {log.location.location_room && !log.location.location_name && <div>{log.location.location_room}</div>}
                    {log.location.location_room && log.location.location_name && <div>{log.location.location_room}:{log.location.location_name}</div>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetLog;
