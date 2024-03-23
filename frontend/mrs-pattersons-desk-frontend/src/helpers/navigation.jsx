import ListAllAssignments from "../components/ListAllAssignments";
import Home from "../components/Home";
import Login from "../components/Login";
import AssignmentDetail from "../components/AssignmentDetail";

export const nav = [
    { path: "/",                            name: "Home",           element: <Home />,                  isMenu: false,  isPrivate: false },
    { path: "/assignments",                 name: "Assignments",    element: <ListAllAssignments />,    isMenu: true,   isPrivate: true },
    { path: "/assignments/:assignmentId",   name: "N/A",            element: <AssignmentDetail />,      isMenu: false,  isPrivate: true },
    { path: "/login",                       name: "Login",          element: <Login />,                 isMenu: false,  isPrivate:false },
];