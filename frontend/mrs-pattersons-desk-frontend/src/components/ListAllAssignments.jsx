import { AuthData } from "../auth/AuthWrapper";
import { useState, useEffect } from "react";
import { getAllAssignments } from "../helpers/apiCalls";
import { Link } from "react-router-dom";
import assignmentNames from "../helpers/assignmentNames";
import PropTypes from 'prop-types';
import "../App.css";

export default function ListAllAssignments() {

    const [assignments, setAssignments] = useState([]);
    const { user } = AuthData();

    useEffect(() => {
        getAllAssignments(user.token).then((response) => {
            setAssignments(response);
        });
    }, [user]);

    const mapOfAssignmentCardLists = filterAndMapAssignments(assignments);

    return (
        <>
            <h1 className="text-center pt-3">Dashboard for {user.name}</h1>
            <Link to={"new"} className="btn btn-primary col-lg-6 offset-lg-3 col-10 offset-1">Submit new assignment</Link>
            
            <div className="container">
                <div className="row rounded">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="wip-tab" data-bs-toggle="tab" data-bs-target="#wip-tab-pane" type="button" role="tab" aria-controls="wip-tab-pane" aria-selected="true">WIP</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed-tab-pane" type="button" role="tab" aria-controls="completed-tab-pane" aria-selected="false">Completed</button>
                    </li>
                </ul>
                <div className="tab-content container" id="myTabContent">
                    <div className="tab-pane fade show active " id="wip-tab-pane" role="tabpanel" aria-labelledby="wip-tab" tabIndex="0">
                        <div className="assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-success position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Submitted</span>
                            <div className="row">
                                {"SUBMITTED" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists.SUBMITTED : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>
                        <div className="assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-secondary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>In Review</span>
                            <div className="row">
                                {"UNDER_REVIEW" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists["UNDER_REVIEW"] : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>                    
                        <div className="assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-danger position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Needs Rework</span>
                            <div className="row">
                                {"REJECTED" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists["REJECTED"] : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="completed-tab-pane" role="tabpanel" aria-labelledby="completed-tab" tabIndex="0">
                        <div className="assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-primary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Completed</span>
                            <div className="row">
                                {"COMPLETED" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists["COMPLETED"] : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>

    );
}


// Function to filter and sort different assignment statuses
function filterAndMapAssignments(assignments) {
    let mapOfAssignments = {};

    assignments.forEach((assignment) => {
        // Make each assignment a card
        const assignmentCard = <AssignmentCard key={assignment.id} assignment={assignment} />;

        let status = assignment.status;

        if (assignment.status === "RESUBMITTED") {
            status = "SUBMITTED";
        }

        // If this is the first assignment with a given status, lets put an 
        // empty list in that spot in the map
        if (!(assignment.status in mapOfAssignments)) {
            mapOfAssignments[status] = [];
        }

        mapOfAssignments[status].push(assignmentCard);
    });

    return mapOfAssignments;
}

const AssignmentCard = ({assignment}) => {
    return (
        <div className="col-12 col-md-6 col-xl-3 mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title position-relative">Assignment #{assignment.number}{assignment.status === "RESUBMITTED" ? <span className="badge rounded-circle position-absolute resubmitted-badge" style={{right: 0, top: -2}}>R</span> : null}</h5>
                    <p className="card-text">{assignmentNames[assignment.number]}</p>
                    <Link to={`${assignment.id}`} className="btn btn-primary">Details</Link>
                </div>
            </div>
        </div>
    );
}

AssignmentCard.propTypes = {
    assignment: PropTypes.object
}