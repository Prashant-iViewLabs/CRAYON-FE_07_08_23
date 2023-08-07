import {
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';
import { getLocalStorage } from '../../utils/Common';

export default function PublicRoute({ children }) {
    const auth = getLocalStorage('token')
    if (!auth) {
        return children;
    }
}
