import { useParams, Link , useLocation , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthData } from "../auth/AuthWrapper";
import { isEmpty } from "../helpers/utils";
import { getAssignment, createNewOrUpdateAssignment } from "../helpers/apiCalls";
import { statusMapping } from "../helpers/utils";
import "../App.css";
import Alert from "./Alert";
import PropTypes from "prop-types";

export default function AssignmentDetail() {
    const {assignmentId} = useParams();
    const [pageData, setPageData] = useState({assignment: {}, formData: {}});
    const { user } = AuthData();
    const { state: locationState } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getAssignment(user.token, assignmentId).then((res) => {
            setPageData({assignment: res, formData: res});
        })
    }, [assignmentId, user]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        const updatedFormData = {...pageData.formData, [name]: value};
        setPageData((prevPageData) => ({...prevPageData, formData: updatedFormData}));
    }

    const handleUpdateStatus = (user, assignment, newStatus) => {
        assignment.status = newStatus;
        const reviewVideoUrl = prompt("Enter the URL for the review video", "");

        if (reviewVideoUrl === "") {
            navigate(`/assignments/${assignment.id}`, {state: {message: "You must include a URL to the review video in order to mark as completed or rejected", alertKind: "alert-danger"}});
        }

        createNewOrUpdateAssignment(user.token, assignment).then(() => {
            navigate("/assignments", {state: {message: `Successfully updated assignment status to ${newStatus}`, alertKind: "alert-success"}});
        }).catch((error) => {
            navigate("", {state: {message: `An error occurred when trying to update status: ${error.message}`, alertKind: "alert-danger"}});
        });
    }

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


    if (isEmpty(pageData.assignment)) {
        return (
            <div className="row bg-light col-10 offset-1 mt-3">
                <h1>Nothing to see here</h1>
            </div>
        );
    } else {
        const unableToEdit = (["UNDER_REVIEW"].includes(pageData.assignment.status)) ? true : false;
        const status = ["UNDER_REVIEW", "REJECTED"].includes(pageData.assignment.status) ? statusMapping[pageData.assignment.status] : pageData.assignment.status;

        return (
            <>
                { locationState ? <Alert message={locationState.message} alertKind={locationState.alertKind} /> : null }
                <h1 className="text-center pt-3">Assignment {pageData.assignment.number} <span className={`${badgeBackgroud()} badge rounded-pill`}>{status}</span></h1>
                <div className="row">
                    <form>
                        <fieldset disabled>
                            <div className="mb-3">
                                <label htmlFor="githubUrl" className="form-label">GitHub URL</label>
                                <input type="text" className="form-control" id="githubUrl" name="githubUrl" value={pageData.formData.githubUrl} onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="branch" className="form-label">Branch</label>
                                <input type="text" className="form-control" id="branch" name="branch" value={pageData.formData.branch} onChange={handleChange}/>
                            </div>
                        </fieldset>
                        { unableToEdit ? null :  (<div className="mb-3"><Link to={"edit"} className="btn btn-primary">Edit</Link></div>)}
                    </form>
                </div>
                <div className="row justify-content-end">
                    <AssignmentDetailsActionButtons user={user} assignment={pageData.assignment} updateStatus={handleUpdateStatus}/>
                </div>
            </>
        );
    }
}

const AssignmentDetailsActionButtons = ({user, assignment, updateStatus}) => {
    return (
        <>
            {user.isReviewer ? (
                <>
                    <button className="btn btn-success mb-3 col-12 col-md-6 col-xl-2" onClick={() => updateStatus(user, assignment, "COMPLETED")}>
                        Mark complete
                    </button>
                    <button className="btn btn-danger mb-3 ms-2 col-12 col-md-6 col-xl-2" onClick={() => updateStatus(user, assignment, "REJECTED")}>
                        Reject
                    </button>
                </>
            ) : null}

            <Link to={"/assignments"} 
                                    className="btn btn-info mb-3 col-12 col-md-6 col-xl-2 float-end" 
                                    style={{marginLeft: 10}}>
                {"<- Back to Assignments"}
            </Link>
        </>
    );
}

AssignmentDetailsActionButtons.propTypes = {
    user: PropTypes.object,
    assignment: PropTypes.object,
    updateStatus: PropTypes.func
}