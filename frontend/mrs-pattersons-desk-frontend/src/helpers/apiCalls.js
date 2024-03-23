const BACKEND_URL = 'http://localhost:8080/api';

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

    const response = await fetch('http://localhost:8080/api/assignments', options);

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

    const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}`, options);

    if (response.status !== 200) {
        throw new Error(`Something went wrong. Status code ${response.status}.`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
}