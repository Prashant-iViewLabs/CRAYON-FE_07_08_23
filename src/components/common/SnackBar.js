import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { setAlert } from '../../redux/configSlice'
import { ALERT_TYPE } from '../../utils/Constants';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
    const dispatch = useDispatch()
    const { show, type, msg } = useSelector((state) => state.config.alert)
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAlert({ show: false, type: ALERT_TYPE.SUCCESS }));
    };

    return (
        <Snackbar open={show} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    );
}