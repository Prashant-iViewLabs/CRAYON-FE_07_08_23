import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import locale from '../../../i18n/locale'
import TextField from '@mui/material/TextField';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Switch from '@mui/material/Switch';
import { Paper } from '@mui/material';
import { BUILD_SEARCH } from '../../../utils/Constants'
import Slider from '@mui/material/Slider';
import ButtonMenu from '../../common/ButtonMenu';

const BlueSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: theme.palette.blueButton500.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.blueButton400.main, theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.blueButton500.main,
    },
}));

function valuetext(value) {
    return `${value}°C`;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '45%',
    marginRight: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.black,
        borderRadius: '20px',
    }
}))

const tempArray = [1, 2]

export default function BuildSearch() {
    const i18n = locale.en;
    const theme = useTheme()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [value, setValue] = useState([20, 37]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Typography sx={{
                fontSize: '36px',
                fontWeight: 700,
                ml: 6
            }}>{i18n['buildSearch.title']}</Typography>

            <Paper sx={{ p: 3 }}>
                {BUILD_SEARCH.map((item, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <ButtonMenu />

                        <StyledTextField label={item.label} id="search" size="small" />

                        <BlueSwitch defaultChecked />
                    </Box>

                ))}
                {tempArray.map((item, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3,
                        alignItems: 'center'
                    }}>

                        <Button
                            id="broad"
                            aria-controls={open ? 'broad-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="contained"
                            disableElevation
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDownIcon />}
                            color="redButton"
                            sx={{ mr: 2 }}
                        >
                            {i18n['buildSearch.and']}
                        </Button>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            color="blueButton500"
                            sx={{
                                width: '45%',
                                mr: 1
                            }}
                        />
                        <BlueSwitch defaultChecked />
                    </Box>
                ))}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 1,
                    mt: 5
                }}>
                    <Button variant="contained" color="redButton" sx={{ width: '18%', mr: 3 }}>{i18n['buildSearch.update']}</Button>
                    <Button variant="contained" color="redButton" sx={{ width: '18%' }}>{i18n['buildSearch.clearAll']}</Button>

                </Box>
            </Paper>
        </Box>
    );
}