import Switch from '@mui/material/Switch';
import { styled, alpha } from '@mui/material/styles';


const BlueSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: theme.palette.blueButton500.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.blueButton500.main, theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.blueButton500.main,
    },
    '& .MuiSwitch-track': {
        // marginTop: '-9px'
    }
}));

export default function ToggleSwitch({ id = "switch", checked = false, onChange }) {
    return (<BlueSwitch id={id} checked={checked} onChange={onChange} />)
}