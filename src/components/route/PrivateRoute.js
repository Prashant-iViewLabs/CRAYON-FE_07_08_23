import {
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';
import { getLocalStorage } from '../../utils/Common';

export default function PrivateRoute({ children }) {
    const auth = getLocalStorage('token')
    const userType = getLocalStorage('userType')
    const { pathname } = useLocation()

    if (!auth) {
        return <Navigate to="/" replace={true} />;
    }

    if (userType == 10) {
        if (pathname.includes('candidate')) {
            return <Navigate to="employer/my-jobs" replace={true} />
        }
    } else if (userType == 20) {
        if (pathname.includes('employer') || pathname.includes('admin')) {
            return <Navigate to="candidate/my-jobs" replace={true} />
        }
    }
    return children;
}
