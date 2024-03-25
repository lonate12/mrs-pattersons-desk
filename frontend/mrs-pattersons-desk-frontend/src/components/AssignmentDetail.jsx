import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthData } from "../auth/AuthWrapper";
import { isEmpty } from "../helpers/utils";
import { getAssignment } from "../helpers/apiCalls";

export default function AssignmentDetail() {
    const {assignmentId} = useParams();
    const [pageData, setPageData] = useState({assignment: {}, formData: {}});
    const [enableEdit, setEnableEdit] = useState(false);
    const { user } = AuthData();

    useEffect(() => {
        getAssignment(user.token, assignmentId).then((res) => {
            console.log(res);
            setPageData({assignment: res, formData: res});
        })
    }, [assignmentId, user]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        const updatedFormData = {...pageData.formData, [name]: value};
        setPageData((prevPageData) => ({...prevPageData, formData: updatedFormData}));
    }


    if (isEmpty(pageData.assignment)) {
        return (
            <div className="row bg-light col-10 offset-1 mt-3">
                <h1>Nothing to see here</h1>
            </div>
        );
    } else {
        const submitted = (["SUBMITTED", "RESUBMITTED"].includes(pageData.assignment.status)  && !enableEdit) ? true : false;

        return (
            <div className="row bg-light col-10 offset-1 mt-3" style={{marginTop: 20}}>
                <h1 className="text-center pt-3">Assignment #{pageData.assignment.number} <span className="badge text-bg-secondary rounded-pill">{pageData.assignment.status}</span></h1>
                <div className="row">
                    <form>
                        <fieldset disabled={submitted}>
                            <div className="mb-3">
                                <label htmlFor="githubUrl" className="form-label">GitHub URL</label>
                                <input type="text" className="form-control" id="githubUrl" name="githubUrl" value={pageData.formData.githubUrl} onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="branch" className="form-label">Branch</label>
                                <input type="text" className="form-control" id="branch" name="branch" value={pageData.formData.branch} onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <button className={submitted ? "btn btn-danger" : "btn btn-primary"} 
                                    type="submit">
                                        {submitted ? "Already submitted" : "Submit"}
                                </button>
                            </div>
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
            </div>
        );
    }
}