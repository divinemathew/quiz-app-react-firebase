import React from 'react'
import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DataFetch from "../../hooks/DataFetch";

export default function RequestInitModal({ modalShow, setModalShow, asset, requestFn, isError }) {
    const [project, setProject] = useState("");
    const [comments, setComments] = useState("");
    const [disable, setDisable] = React.useState(false);
    const [location, setLocation] = useState({ location_room: "", location_name: "" });
    const [Index, setIndex] = useState(null)

    const { data: projectList } = DataFetch("/", "projects");
    const { data: locationsFull } = DataFetch("/", "locationsFull");

    const handleOnchangeLocationRoom = (e) => {
        setIndex(e.target.value);
        if (e.target.value) {
            setLocation({ location_room: locationsFull[e.target.value].location_room });
        } else{
            setLocation({location_room:""})
        }
        setDisable(false);
    };
    const handleOnchangeLocationName = (e) => {
        if(e.target.value === ""){
            setLocation({location_room:""})
        }
        setLocation({ location_room: locationsFull[Index].location_room, location_name: e.target.value });
        setDisable(false);
    };

    return (
        <Modal
            show={modalShow}
            onEnter={() => setDisable(false)}
            onHide={() => { setModalShow(false); setProject(""); setLocation(""); }}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Request {asset.asset_id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><b>Asset ID:</b> {asset.asset_id}</p>
                <div>
                    <b>Project:</b>
                    <div className="dropdown show">
                        {projectList && (
                            <select
                                class="form-select"
                                aria-label="Project where it's needed"
                                onChange={(e) => setProject(e.target.value)}
                            >
                                <option value="" disabled selected>New project</option>
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
                <div>
                    <b>Comments:</b>
                    <Form.Control
                        type="text"
                        placeholder="Why do you need it?"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                {isError && isError.code === "ERR_NETWORK"
                    ? <Button variant="warning" disabled>{isError.message}</Button>
                    : isError && isError.code === "ERR_BAD_REQUEST" ?
                        <Button variant="warning" disabled>{isError.response.data.message}</Button> :
                        isError && isError.code === "ERR" ?
                            <Button variant="btn btn-success" disabled={disable} onClick={() => {
                                setDisable(true);
                                requestFn(asset, project, location, comments);
                                setProject("");
                                setLocation("");
                            }}>Request
                            </Button> :
                            <Button className="btn btn-success" disabled={disable} onClick={() => {
                                setDisable(true);
                                requestFn(asset, project, location, comments);
                                setProject("");
                                setLocation("");
                            }}>Request
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
