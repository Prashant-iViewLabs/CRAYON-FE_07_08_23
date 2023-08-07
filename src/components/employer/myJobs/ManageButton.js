import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import locale from '../../../i18n/locale'
import { alpha, styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import profile from '../../../assets/profile.png';


const StyledMenu = styled((props) => (
    <Menu
        elevation={4}
        // anchorOrigin={{
        //     vertical: 'bottom',
        //     horizontal: 'right',
        // }}
        // transformOrigin={{
        //     vertical: 'top',
        //     horizontal: 'right',
        // }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 5,
        minWidth: 260,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        backgroundColor: theme.palette.menuBackground,
        padding: '0 8px 0 24px',
        '& .MuiList-root': {
            paddingTop: 0
        },
        // boxShadow:
        //     'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        // '& .MuiMenu-list': {
        //     padding: '4px 0',
        // },
        // '& .MuiMenuItem-root': {
        //     '& .MuiSvgIcon-root': {
        //         fontSize: 18,
        //         color: theme.palette.text.secondary,
        //         marginRight: theme.spacing(1.5),
        //     },
        //     '&:active': {
        //         backgroundColor: alpha(
        //             theme.palette.primary.main,
        //             theme.palette.action.selectedOpacity,
        //         ),
        //     },
        // },
        '& .MuiTypography-root': {
            fontSize: '14px',
            fontWeight: 700
        }
    },
    '& .MuiFormControlLabel-root': {
        height: '30px',
        '& .MuiTypography-root': {
            fontSize: '12px',
            color: theme.palette.lightText,
            fontWeight: 400,

        }
    }
}));

const BlueSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: theme.palette.blueButton400.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.blueButton400.main, theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.blueButton400.main,
    },
}));

export default function ManageButton({ index }) {
    const i18n = locale.en;
    const theme = useTheme()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        < >
            <Button
                id="customized-button"
                aria-controls={open ? 'customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                elevation={0}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                color='blueButton400'
                sx={{ ml: 1, boxShadow: 0, width: '80%' }}
            >
                {i18n['manageJob.manage']}
            </Button>
            <StyledMenu
                id="customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {/* <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                }}>
                    <Typography display="block" gutterBottom>
                        {i18n['teamMenu.title']}
                    </Typography>
                    <IconButton
                        color='blueButton300'
                        aria-label="add menu"
                        sx={{
                            paddingRight: 0,

                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>

                    <Box
                        component="img"
                        className="profileAvatar"
                        alt="crayon logo"
                        src={profile}
                        sx={{
                            height: 24,
                        }}
                    />
                    <FormControlLabel
                        value="start"
                        control={<Switch color="default" disabled defaultChecked />}
                        label="Louie Volkman (Admin)"
                        labelPlacement="start"
                        sx={{
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Box
                        component="img"
                        className="profileAvatar"
                        alt="crayon logo"
                        src={profile}
                        sx={{
                            height: 24,
                        }}
                    />

                    <FormControlLabel
                        value="start"
                        control={<Switch color="default" disabled defaultChecked />}
                        label="User Onhovered (Admin)"
                        labelPlacement="start"
                        sx={{
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Box
                        component="img"
                        className="profileAvatar"
                        alt="crayon logo"
                        src={profile}
                        sx={{
                            height: 24,
                        }}
                    />

                    <FormControlLabel
                        value="start"
                        control={<Switch color="default" />}
                        label="Fernando Pidrilio (Team Member)"
                        labelPlacement="start"
                        sx={{
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Box
                        component="img"
                        className="profileAvatar"
                        alt="crayon logo"
                        src={profile}
                        sx={{
                            height: 24,
                        }}
                    />

                    <FormControlLabel
                        value="start"
                        control={<BlueSwitch defaultChecked />}
                        label="Adeline O'Reilly (Team Member)"
                        labelPlacement="start"
                        sx={{
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                    />
                </Box> */}

                 <Box>
                 <Typography sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: '0.25px',
                    }} >
                       Job status:
                    </Typography>
                 </Box>
                 <Box>
                 <Typography sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: '0.25px',
                    }} >
                       Job actions:
                    </Typography>
                 </Box>
                 <Box>
                 {/* <Button variant='contained' color='redButton100' >{i18n['manageJob.talentText']}</Button>
                 <Button variant='contained' color='redButton100' >{i18n['manageJob.talentText']}</Button>
                 <Button variant='contained' color='redButton100' >{i18n['manageJob.talentText']}</Button>
                 <Button variant='contained' color='redButton100' >{i18n['manageJob.talentText']}</Button> */}
                 </Box>
            </StyledMenu>
        </>

    );
}