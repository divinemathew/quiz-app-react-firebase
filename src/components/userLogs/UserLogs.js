/**
 * @UserLogs.js
 * @brief
 *
 * Displays the userlogs assigned to a user
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
 * Userlogs(Fn) - UserLogs Component
 *
 * @note
 *
 * Revision History:
 * 111122 - Creation Date - Divine A Mathew
 *
 *
 */
//-----------------------------------------------------------------------------
// All Imports
//-----------------------------------------------------------------------------
import React from "react";
import "./userLogs.css";
import AppConfig from "../../AppConfig.json";
import { Button } from "react-bootstrap";
import { useState } from "react";
//-----------------------------------------------------------------------------
// UserLogs Component Function
//-----------------------------------------------------------------------------
function UserLogs({
  logs,
  error,
  loading,
  old_logs,
  old_logs_error,
  old_logs_loading,
}) {
  const [displayOldLogs, setDisplayOldLogs] = useState(false);
  const handleOnclickOldLogs = () => {
    setDisplayOldLogs(!displayOldLogs);
  };
  return (
    <div className="log-table-container">
      <div className="table-header blue">
        <h5>USER HISTORY LOG </h5>
      </div>
      <div className="log-button">
        {!displayOldLogs && (
        <Button variant="success" onClick={handleOnclickOldLogs}>
          View Old Logs
        </Button>)}
        {displayOldLogs && (
        <Button variant="danger" onClick={handleOnclickOldLogs}>
          View Current Logs
        </Button>)}
      </div>
      {!displayOldLogs && (
        <div className="my-custom-scroll">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">AssetID / Time</th>
                <th scope="col">Request Type</th>
                <th scope="col">Status</th>
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
              {error && (
                <div class="alert alert-danger" role="alert">
                  {error.response.data.message.toUpperCase()}
                </div>
              )}
              {logs &&
                logs.map((log) => (
                  <tr>
                    <td>
                      <div className="asset-name">
                        <div className="asset-title">
                          <a href={`${AppConfig.domain}/asset/${log.asset_id}`}>
                            {log.asset_id}
                          </a>
                        </div>
                        <div className="asset-sub">
                          {new Date(log.updatedAt).toLocaleString("en-GB", {
                            dateStyle: "full",
                            timeStyle: "short",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </td>
                    <td>{log.req_type.toUpperCase()}</td>
                    <td>
                      <div>{log.status.toUpperCase()}</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {displayOldLogs && (
        <div className="my-custom-scroll">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">AssetID / Time</th>
                <th scope="col">Request Type</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {old_logs_loading && (
                <div class="d-flex justify-content-center">
                  <div class="spinner-border" role="status">
                    <span class="sr-only"></span>
                  </div>
                </div>
              )}
              {old_logs_error && (
                <div class="alert alert-danger" role="alert">
                  {error.response.data.message.toUpperCase()}
                </div>
              )}
              {old_logs &&
                old_logs.map((log) => (
                  <tr>
                    <td>
                      <div className="asset-name">
                        <div className="asset-title">
                          <a href={`${AppConfig.domain}/asset/${log.asset_id}`}>
                            {log.asset_id}
                          </a>
                        </div>
                        <div className="asset-sub">
                          {new Date(log.updatedAt).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "short",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </td>
                    <td>{log.req_type.toUpperCase()}</td>
                    <td>
                      <div>{log.status.toUpperCase()}</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserLogs;
