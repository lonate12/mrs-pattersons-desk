import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthData } from "../auth/AuthWrapper";
import { getAssignment, createNewOrUpdateAssignment, deleteAssignmentCall } from "../helpers/apiCalls";
import { statusMapping } from "../helpers/utils";
import { assignmentsList } from "../helpers/assignmentNames";


export default function CreateEditAssignment() {

    const { assignmentId } = useParams();
    const { user }= AuthData();
    const emptyAssignment = {assignmentNumber: null, githubUrl: "", status: "", id: null, branch:"", reviewVideoUrl: ""}
    const emptyFormData = {assignmentNumber: null, githubUrl: "", branch:""}
    const [pageData, setPageData] = useState({assignment: emptyAssignment, formData: emptyFormData});
    const isNew = assignmentId === undefined ? true : false;
    const navigate = useNavigate();

    useEffect(() => {
        if (isNew) return;

        getAssignment(user.token, assignmentId).then((res) => {
            console.log(res);
            setPageData({assignment: res, formData: res});
        })
    }, [assignmentId, user, isNew]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        const updatedFormData = {...pageData.formData, [name]: value};
        setPageData((prevPageData) => ({...prevPageData, formData: updatedFormData}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let response;

        if (!isNew) {
            let updatedObject = {...pageData.assignment, ...pageData.formData};
            updatedObject.assignmentNumber = parseInt(updatedObject.assignmentNumber);
            console.log(updatedObject);
            response = await createNewOrUpdateAssignment(user.token, updatedObject);
        } else {
            let clone = {...pageData.formData};
            clone.numbassignmentNumberer = parseInt(clone.assignmentNumber);
            console.log(clone);
            response = await createNewOrUpdateAssignment(user.token, clone);
        }

        console.log(response);

        const successMessage = `Assignment successfully ${isNew ? "created!" : "updated!"}`;

        navigate(`/assignments/${response.id}`, {state: {message: successMessage, alertKind: "alert-success"}});
    }

    const dropDown = () => {
        const options = assignmentsList.map((assignment) => {
            return (
                <option key={assignment.num} value={assignment.num}>{assignment.num}: {assignment.name}</option>
            );
        });
        return (
            <div className="mb-3">
                <select className="form-select" required={true} aria-label="assignment-number-select" name="assignmentNumber" onChange={handleChange}>
                    <option defaultValue>Select assignment to submit</option>
                    { options }
                </select>
            </div>
        );
    }

    const deleteAssignment = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this assignment? This action is irreversible.");
        if (!confirmDelete) return navigate(`/assignments/${assignmentId}`, {state: {message: "Canceled delete", alertKind: "alert-warning"}});

        const response = await deleteAssignmentCall(user.token, assignmentId);
        navigate("/assignments", {state: {message: `Assignment ID ${assignmentId} deleted`, alertKind: "alert-danger"}});
    }

    const unableToEdit = (["UNDER_REVIEW"].includes(pageData.assignment.status)) ? true : false;
    const status = ["UNDER_REVIEW", "REJECTED"].includes(pageData.assignment.status) ? statusMapping[pageData.assignment.status] : pageData.assignment.status;

    const badgeBackgroud = () => {
        switch (pageData.assignment.status) {
            case "SUBMITTED" || "RESUBMITTED":
                return "text-bg-success";
            case "UNDER_REVIEW":
                return "text-bg-secondary";
            case "REJECTED":
                return "text-bg-danger";
            case "COMPLETED":
                return "text-bg-primary";
            default:
                return "text-bg-secondary";
        }
    }

    return (
        <>
            <h1 className="text-center pt-3">{isNew ? "Create new submission" : `Assignment #${pageData.assignment.number}`} <span className={`badge ${badgeBackgroud()} rounded-pill`}>{status}</span></h1>
            <div className="row">
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={unableToEdit}>
                        { isNew ? dropDown() : null }
                        <div className="mb-3">
                            <label htmlFor="githubUrl" className="form-label">GitHub URL</label>
                            <input type="text" required={true} className="form-control" id="githubUrl" name="githubUrl" value={pageData.formData.githubUrl} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="branch" className="form-label">Branch</label>
                            <input type="text" required={true} className="form-control" id="branch" name="branch" value={pageData.formData.branch} onChange={handleChange}/>
                        </div>
                        { 
                            unableToEdit ? 
                                <button className="btn btn-danger">Unable to edit an In Review assignment</button> :  
                                (<EditButtons deleteAssignment={deleteAssignment} isNew={isNew} />)
                        }
                    </fieldset>
                </form>
            </div>
            <div className="row">
                <Link to={"/assignments"} 
                                className="btn btn-secondary mb-3" 
                                style={{marginLeft: 10}}>
                                    Back to Assignments
                </Link>
            </div>
        </>
    );
}

const EditButtons = ({deleteAssignment, isNew}) => {
    return (
        <div className="mb-3">
            <button className="btn btn-primary" type="submit">{isNew ? "Submit" : "Save edits"}</button>
            {
                isNew ? null : <button className="btn btn-danger ms-3" onClick={deleteAssignment}>Delete Assignment</button>
            }
        </div>
    );
}