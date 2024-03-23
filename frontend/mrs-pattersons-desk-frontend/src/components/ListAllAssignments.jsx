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
        <div className="row">
            <h1>This is the assignments page</h1>
            <p>Username: {user.name}</p>
            { assignmentListItems ? <ul className="list-group">{assignmentListItems}</ul> : null }
        </div>
    );
}