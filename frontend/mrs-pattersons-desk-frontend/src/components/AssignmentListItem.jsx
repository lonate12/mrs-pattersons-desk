import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function AssignmentListItem({id, number, status, githubUrl, branch}) {
    return (
        <li className="list-group-item">
            <Link to={`/assignments/${id}`}>{number}: {githubUrl} --- Status: {status} | {branch}</Link>
        </li>
    );
}

AssignmentListItem.propTypes = {
    id: PropTypes.number,
    number: PropTypes.number,
    status: PropTypes.string,
    githubUrl: PropTypes.string,
    branch: PropTypes.string
}