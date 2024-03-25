import { AuthData } from "../auth/AuthWrapper";
import { useState, useEffect } from "react";
import { getAllAssignments } from "../helpers/apiCalls";
import AssignmentListItem from "./AssignmentListItem";

export default function ListAllAssignments() {

    const [assignments, setAssignments] = useState([]);
    const { user } = AuthData();

    useEffect(() => {
        getAllAssignments(user.token).then((response) => {
            setAssignments(response);
        });
    }, [user]);

    const assignmentListItems = assignments.map((assignment) => <AssignmentListItem key={assignment.id}
                    id={assignment.id} 
                    number={assignment.number} 
                    status={assignment.status} 
                    githubUrl={assignment.githubUrl} 
                    branch={assignment.branch} 
                />
        );
        

    return (
        <>
            {/* <div className="row bg-light col-10 offset-1" style={{marginTop: 20, marginBottom: 20, paddingBottom: 20}}>
                <h1 className="text-center pt-3">Dashboard for {user.name}</h1>
                <button className="btn btn-primary col-lg-6 offset-lg-3 col-10 offset-1">Submit new assignment</button>
                <div className="container">
                    <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                        <span className="badge rounded-pill bg-success position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Submitted</span>
                        <p className="mt-3">test</p>
                    </div>
                    <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                        <span className="badge rounded-pill bg-secondary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>In Review</span>
                        <p className="mt-3">test</p>
                    </div>                    
                    <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                        <span className="badge rounded-pill bg-danger position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Needs Rework</span>
                        <p className="mt-3">test</p>
                    </div>
                </div>
                <div className="container">
                    <div className="boarder boarder-primary form-control mt-3 mb-3 position-relative">
                        <span className="badge rounded-pill bg-primary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Completed</span>
                        <p className="mt-3">test</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <p>Username: {user.name}</p>
                { assignmentListItems ? <ul className="list-group">{assignmentListItems}</ul> : null }
            </div> */}
            
            <div className="container bg-light mt-3 mb-3 rounded">
                <div className="row">
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
                        <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-success position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Submitted</span>
                            <p className="mt-3">test</p>
                        </div>
                        <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-secondary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>In Review</span>
                            <p className="mt-3">test</p>
                        </div>                    
                        <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-danger position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Needs Rework</span>
                            <p className="mt-3">test</p>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="completed-tab-pane" role="tabpanel" aria-labelledby="completed-tab" tabIndex="0">
                        <div className="boarder boarder-primary form-control mt-5 mb-3 position-relative">
                            <span className="badge rounded-pill bg-primary position-absolute" style={{left: 20, top: -15, fontSize: 20}}>Completed</span>
                            <p className="mt-3">test</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>

    );
}