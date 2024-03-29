import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthData } from "../auth/AuthWrapper";
import { getAssignment, createNewOrUpdateAssignment, deleteAssignmentCall } from "../helpers/apiCalls";
import { statusMapping } from "../helpers/utils";
import { assignmentsList } from "../helpers/assignmentNames";
import PropTypes from "prop-types";


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
            // If we're resubmitting after a rejected status, need to update the status field
            updatedObject.status = "RESUBMITTED";
            response = await createNewOrUpdateAssignment(user.token, updatedObject);
        } else {
            let clone = {...pageData.formData};
            clone.assignmentNumber = parseInt(clone.assignmentNumber);
            response = await createNewOrUpdateAssignment(user.token, clone);
        }

        const successMessage = `Assignment successfully ${isNew ? "created!" : "updated!"}`;

        navigate(`/assignments`, {state: {message: successMessage, alertKind: "alert-success"}});
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

        deleteAssignmentCall(user.token, assignmentId).then(() => {
            navigate("/assignments", {state: {message: `Assignment deleted successfully.`, alertKind: "alert-success"}});
        }).catch((error) => {
            navigate("/assignments", {state: {message: `There was an issue when trying to delete the assignment. ${error.message}`, alertKind: "alert-danger"}});
        })
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
            <h1 className="text-center pt-3">{isNew ? "Create new submission" : `Assignment ${pageData.assignment.number}`} <span className={`badge ${badgeBackgroud()} rounded-pill align-top`}>{status}</span></h1>
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
                                (<EditButtons deleteAssignment={deleteAssignment} isNew={isNew} currentStatus={pageData.assignment.status}/>)
                        }
                    </fieldset>
                </form>
            </div>
            <div className="row justify-content-end">
                <Link to={"/assignments"} 
                                        className="btn btn-info mb-3 col-12 col-md-6 col-xl-2 float-end" 
                                        style={{marginLeft: 10}}>
                    {"<- Back to Assignments"}
                </Link>
            </div>
        </>
    );
}

const EditButtons = ({deleteAssignment, isNew, currentStatus}) => {
    const mainActionButtonPrompt = () => {
        if (isNew) {
            return "Submit";
        }

        return currentStatus === "REJECTED" ? "Resubmit" : "Save edits";
    };
    return (
        <div className="mb-3">
            <button className="btn btn-primary" type="submit">{mainActionButtonPrompt()}</button>
            {
                isNew ? null : <button className="btn btn-danger ms-3" onClick={deleteAssignment}>Delete Assignment</button>
            }
        </div>
    );
}

EditButtons.propTypes = {
    deleteAssignment: PropTypes.func,
    isNew: PropTypes.bool,
    currentStatus: PropTypes.string
}