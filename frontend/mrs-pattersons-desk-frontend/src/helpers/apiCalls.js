// const BACKEND_URL = 'http://localhost:8080/api';
const BACKEND_URL = 'https://zfimdqw3si.us-east-2.awsapprunner.com/api';

/* 
 * Call to login service to request a JWT token
 * @param {string} username     Requestor username
 * @param {string} password     Requestor password
 * @return {Object}             Contains token key which has the JWT token
 * @throws {Error}              If username/password is invalid, throws an "Invalid username/password" error
 */
export async function loginCall(username, password) {
    const authParams = { username, password };

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(authParams)
    });

    const jsonReponse = await response.json();
    return jsonReponse;
}


/* 
 * @param {string} token    JWT token to be used in the Auth header
 * @return [assignments]    List of assignments owned by the requesting user    
 */
export async function getAllAssignments(token) {
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    const options = {
        headers: headers,
        credentials: "include",
        method: "GET",
        mode: "cors"
    };

    const response = await fetch(`${BACKEND_URL}/assignments`, options);

    if (response.status !== 200) {
        throw new Error(`Something went wrong. Status code ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
}

/* 
 * @param {string} token            JWT token to be used in the Auth header
 * @param {string} assignmentId     Assignment id in order to get the proper assignment
 * @return [assignments]            List of assignments owned by the requesting user    
 */
export async function getAssignment(token, assignmentId) {
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    const options = {
        headers: headers,
        credentials: "include",
        method: "GET",
        mode: "cors"
    };

    const response = await fetch(`${BACKEND_URL}/assignments/${assignmentId}`, options);

    if (response.status !== 200) {
        throw new Error(`Something went wrong. Status code ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
}


/* 
 * @param {string} token            JWT token to be used in the Auth header
 * @param {string} assignment       An assignment object, needs to have X, X, X, X, X
 * @return [assignments]            Newly created assignment   
 */
export async function createNewOrUpdateAssignment(token, assignment) {
    // These variables will be changed if it's a call to update vs. create new
    let method = "POST"
    let endpoint = "";
    
    if ("id" in assignment) {
        method = "PUT";
        endpoint = `/${assignment.id}`;
    }
    
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    const options = {
        headers: headers,
        credentials: "include",
        method: method,
        mode: "cors",
        body: JSON.stringify(assignment)
    };

    const response = await fetch(`${BACKEND_URL}/assignments${endpoint}`, options);

    if (response.status !== 200) {
        console.log(`Response error: ${response}`);
        throw new Error(`Something went wrong. Status code ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
}



/* 
 * @param {string} token            JWT token to be used in the Auth header
 * @param {string} assignmentId     Assignment ID of assignment to be deleted
 * @return [boolean]                Hardcoded true
 */
export async function deleteAssignmentCall(token, assignmentId) {
    // These variables will be changed it's a call to update vs. create new
    let method = "DELETE"
    
    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    const options = {
        headers: headers,
        credentials: "include",
        method: method,
        mode: "cors"
    };

    const response = await fetch(`${BACKEND_URL}/assignments/${assignmentId}`, options);

    if (response.status !== 200) {
        console.log(`Response error: ${response}`);
        throw new Error(`Something went wrong. Status code ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
}