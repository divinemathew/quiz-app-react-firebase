import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/navBar/NavBar";
import Paginate from "../../components/paginate/Paginate";
import DataFetch from "../../hooks/DataFetch";
import axios from "axios";
import RequestInitModal from "../../components/modals/RequestInitModal";
import ApiConfig from "../../AppConfig.json";
import { toast } from "react-toastify";
import { ReactSession }  from 'react-client-session';

function SearchPage({ username, userid }) {
  var userToken = ReactSession.get("dats_token")? ReactSession.get("dats_token") : "";
  var userName = ReactSession.get("dats_user")? ReactSession.get("dats_user") : "";
  var AuthStr = 'Bearer '.concat(userToken);

  const { search_term } = useParams();
  const [displayData, setDisplayData] = useState(null);
  const api_search = ApiConfig.search;
  const { data, error, loading } = DataFetch(api_search, search_term);

  const [assetInTransaction, setAssetInTransaction] = useState({});
  const [requestInitModalShow, setRequestInitModalShow] = useState(false);
  const [requestInitError, setRequestInitError] = useState(false);

  const ip = ApiConfig.root;
  const api_request = ApiConfig.request;
  const navigate = useNavigate();
  const handleRequest = (asset, project, location, comments) => {
    var req = {
      req_type: "request",
      asset_id: asset.asset_id,
      name: asset.name,
      from: userid,
      to: asset.assignee,
      project: project,
      location: location,
      comments: comments,
    };
    console.log(location);
    if ((req.location.location_room === "") || (req.location.location_name == "")) {
      toast.error("Error! Location is Mandatory", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      const err = {
        code: "ERR"
      }
      setRequestInitError(err);
    }
    else {
      //POST this request for returning item
      axios
        .post(ip + api_request, req, { timeout: 1000 * 5, headers: { Authorization: AuthStr, datsuser: userName } })
        .then((response) => {
          //On POST request success,
          setRequestInitModalShow(false);
        })
        .catch((error) => {
          //On POST request fail,
          setRequestInitError(error);
        });
    }
  };

  return (
    <div class="dashboard-container">
      <NavBar username={username} ></NavBar>
      <RequestInitModal
        modalShow={requestInitModalShow}
        setModalShow={setRequestInitModalShow}
        asset={assetInTransaction}
        requestFn={handleRequest}
        isError={requestInitError}
      />
      <div className="table-container">
        <div className="top-container">
          <div className="dash-board-name">
            <h3>GLOBAL SEARCH</h3>
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
        <div className="table-container-holder-search">
          <div className="table-header green">
            <h5>SHOWING RESULTS FOR "{search_term.toUpperCase()}"</h5>
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Asset ID/Name</th>
                <th scope="col">Status</th>
                <th scope="col">Assignee/Location</th>
                <th scope="col">Action</th>
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
                displayData.map((data) => (
                  <tr>
                    <td>
                      <div className="asset-name">
                        <div className="asset-title">
                          <a
                            href={`${ApiConfig.domain}/asset/${data.asset_id}`}
                          >
                            {data.asset_id}
                          </a>
                        </div>
                        <div className="asset-sub">
                          {data.name.substring(0, 100).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td>{data.condition}</td>
                    <td>
                      {data.assignee.toUpperCase()}{" "}
                      <div className="asset-sub">
                        {data.location.location_room && !data.location.location_name && <p>{data.location.location_room}</p>}
                        {data.location.location_room && data.location.location_name && <p>{data.location.location_room}:{data.location.location_name}</p>}
                        {!data.location.location_room && <p>Location Unavailable</p>}
                      </div>{" "}
                    </td>
                    <td>
                      {data.assignee !== userid && (
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            setAssetInTransaction(data);
                            setRequestInitError(false);
                            setRequestInitModalShow(true);
                          }}
                        >
                          Request
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {data && (
            <Paginate
              setDisplayData={(datas) => setDisplayData(datas)}
              assets={data}
              itemPerPage={6}
            ></Paginate>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
