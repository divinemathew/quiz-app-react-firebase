import React, { useEffect } from 'react'
import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DataFetch from "../../hooks/DataFetch";

export default function TransferAcceptModal({ modalShow, setModalShow, request, transferFn, isError, setTransferAcceptError }) {
    const [project, setProject] = useState("");
    const [location, setLocation] = useState({ location_room: "", location_name: "" });
    const [Index, setIndex] = useState(null)
    const [disable, setDisable] = useState(false);


    const { data: projectList } = DataFetch("/", "projects");
    const { data: locationsFull } = DataFetch("/", "locationsFull");

    const handleOnchangeLocationRoom = (e) => {
        setIndex(e.target.value);
        setLocation({ location_room: locationsFull[e.target.value].location_room });
        setDisable(false);
        setTransferAcceptError(false);
    };
    const handleOnchangeLocationName = (e) => {
        setLocation({ location_room: locationsFull[Index].location_room, location_name: e.target.value });
        setDisable(false);
        setTransferAcceptError(false);
    };


    return (
        <Modal
            show={modalShow}
            onEnter={() => setDisable(false)}
            onHide={() => { setModalShow(false); setProject(""); setLocation(""); window.location.reload(false) }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Transfer accept</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><b>Asset ID:</b> {request.asset_id}</p>
                <div>
                    <b>Project:</b>
                    <div className="dropdown show">
                        {projectList && (
                            <select
                                class="form-select"
                                aria-label="No Project"
                                onChange={(e) => { setProject(e.target.value); setDisable(false); setTransferAcceptError(false) }}
                            >
                                <option value="" disabled selected>No Project</option>
                                {projectList.map((data) => (
                                    <option value={data.project_id}>
                                        {data.project_id}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div>
                    <b>Location:</b>
                    {locationsFull && (
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            onChange={handleOnchangeLocationRoom}
                        >
                            <option></option>
                            {locationsFull.map((data, index) => (
                                <option
                                    value={index}
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
                            onChange={handleOnchangeLocationName}
                        ><option></option>
                            {(locationsFull[Index].location_name).map((data) => (
                                <option
                                    value={data.name}
                                >
                                    {data.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
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
                )
                    : <Button className="btn btn-success" disabled={disable} onClick={() => {
                        setDisable(true);
                        transferFn(request, project, location);
                        setProject("");
                        setLocation("");
                    }}>Accept
                        {disable
                            ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true" />
                            : ''}
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    )
}
