import { AuthData } from "../auth/AuthWrapper";
import { useState, useEffect } from "react";
import { getAllAssignments, createNewOrUpdateAssignment } from "../helpers/apiCalls";
import { Link, useLocation, useNavigate } from "react-router-dom";
import assignmentNames from "../helpers/assignmentNames";
import PropTypes from 'prop-types';
import "../App.css";
import Alert from "./Alert";

export default function ListAllAssignments() {

    const [assignments, setAssignments] = useState([]);
    const { user } = AuthData();
    const { state: locationState } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getAllAssignments(user.token).then((response) => {
            console.log(response);
            setAssignments(response);
        });
    }, [user]);

    const claimForReview = async (user, assignment) => {
        assignment.status = "UNDER_REVIEW";
        createNewOrUpdateAssignment(user.token, assignment).then(() => {
            navigate("/assignments", {state: {message: "Assignment successfully claimed for review!", alertKind: "alert-success"}});
        }).catch(() => {
            navigate("/assignments", {state: {message: "Something went wrong when trying to claim assignment", alertKind: "alert-danger"}});
        });
        
    }

    const mapOfAssignmentCardLists = filterAndMapAssignments(assignments, user, claimForReview);

    return (
        <>
            { locationState ? <Alert message={locationState.message} alertKind={locationState.alertKind}/> : null }
            <h1 className="text-center pt-3">Dashboard for {user.name}</h1>
            <Link to={"new"} className={`btn btn-primary col-lg-6 offset-lg-3 col-10 offset-1 ${user.isReviewer ? "d-none" : ""}`}>Submit new assignment</Link>
            
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
                        <div className={`assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative ${user.isReviewer ? "d-none" : ""}`}>
                            <span className="badge rounded-pill bg-danger position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Needs Rework</span>
                            <div className="row">
                                {"REJECTED" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists["REJECTED"] : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>
                        <div className={`assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative ${user.isReviewer ? "order-3" : ""}`}>
                            <span className="badge rounded-pill bg-success position-absolute" style={{left: 20, top: -15, fontSize: 20}}>{user.isReviewer ? "Submitted and Resubmitted for review" : "Submitted"}</span>
                            <div className="row">
                                {"SUBMITTED" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists.SUBMITTED : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>
                        <div className={`assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative ${user.isReviewer ? "order-1" : ""}`}>
                            <span className="badge rounded-pill bg-secondary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>In Review</span>
                            <div className="row">
                                {"UNDER_REVIEW" in mapOfAssignmentCardLists ? mapOfAssignmentCardLists["UNDER_REVIEW"] : <h3 className="mt-4">No assignments to view</h3>}
                            </div>
                        </div>                    
                    </div>
                    <div className="tab-pane fade" id="completed-tab-pane" role="tabpanel" aria-labelledby="completed-tab" tabIndex="0">
                        <div className={`assignments-container boarder boarder-primary form-control mt-5 mb-3 position-relative`}>
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
function filterAndMapAssignments(assignments, user, claimForReview) {
    let mapOfAssignments = {};

    assignments.forEach((assignment) => {
        // Make each assignment a card
        const assignmentCard = <AssignmentCard key={assignment.id} assignment={assignment} user={user} claimForReview={claimForReview}/>;

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

const AssignmentCard = ({assignment, user, claimForReview}) => {
    return (
        <div className="col-12 col-md-6 col-xl-3 mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title position-relative">Assignment {assignment.number}{assignment.status === "RESUBMITTED" ? <span className="badge rounded-circle position-absolute resubmitted-badge" style={{right: 0, top: -2}}>R</span> : null}</h5>
                    <p className="card-text">{assignmentNames[assignment.number]}</p>
                    { user.isReviewer && ["SUBMITTED", "RESUBMITTED"].includes(assignment.status) ? <button className="btn btn-primary" onClick={() => claimForReview(user, assignment)}>Claim for review</button> : <Link to={`${assignment.id}`} className="btn btn-primary">Details</Link>}
                </div>
            </div>
        </div>
    );
}

AssignmentCard.propTypes = {
    assignment: PropTypes.object,
    user: PropTypes.object,
    claimForReview: PropTypes.func
}