import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthData } from "../auth/AuthWrapper";
import { isEmpty } from "../helpers/utils";
import { getAssignment } from "../helpers/apiCalls";

export default function AssignmentDetail() {
    const {assignmentId} = useParams();
    const [assignment, setAssignment] = useState({});
    const { user } = AuthData();

    useEffect(() => {
        getAssignment(user.token, assignmentId).then((res) => {
            console.log(res);
            setAssignment(res);
        })
    }, []);


    if (isEmpty(assignment)) {
        return (
            <div className="row bg-light col-10 offset-1">
                <h1>Nothing to see here</h1>
            </div>
        );
    } else {
        return (
            <div className="row bg-light col-10 offset-1">
                <h1>Assignment {assignment.id}</h1>
                <div className="row">
                    <h4>Status: {assignment.status}</h4>
                    <p>Assignment #{assignment.number}</p>
                </div>
            </div>
        );
    }
}