

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import locale from '../../i18n/locale'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 82,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function ButtonMenu({ onMenuClick }) {
    const i18n = locale.en;
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const options = [i18n['searchBar.and'], i18n['searchBar.or']]
    const [selectedOptions, setSelectedOptions] = useState([i18n['searchBar.and']])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        onMenuClick(Boolean(event.currentTarget))
    };
    const handleClose = () => {
        setAnchorEl(null);
        onMenuClick(null)
    };
    const handleClose1 = () => {
        setSelectedOptions(i18n['searchBar.and'])
        setAnchorEl(null);
        onMenuClick(null)
    };
    const handleClose2 = () => {
        setSelectedOptions(i18n['searchBar.or'])
        setAnchorEl(null);
        onMenuClick(null)
    };

    return (
        <>
            <Button
                id="broad"
                aria-controls={open ? 'broad-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained" t
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                color="redButton"
                sx={{ mr: 2, minWidth: '80px' }}
            >
                {selectedOptions}
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose1} disableRipple>
                    {i18n['searchBar.and']}
                </MenuItem>
                <MenuItem onClick={handleClose2} disableRipple>
                    {i18n['searchBar.or']}
                </MenuItem>
            </StyledMenu></>
    );
}