import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import locale from '../../../i18n/locale'
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginTop: 8,
    // background: `${theme.palette.white} !important`,
    borderRadius: '5px',
    // height: 'auto !important',
    position: 'unset',
    '& .MuiAccordionSummary-root': {
        // alignItems: 'start'
    },
    '& .MuiAccordionSummary-content': {
        flexDirection: 'column',
        '.summaryBox1': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: '8px',
            '& .MuiButtonBase-root': {
                borderRadius: '5px',
                minWidth: '19px',
                marginLeft: '8px',
                boxShadow: 'none'
            }
        },
        // '.summaryBox2': {
        //     display: 'flex',
        //     justifyContent: 'space-between',
        //     alignItems: 'center',
        //     marginTop: 8
        // },
        // '.profileAvatar': {
        //     height: 20,
        //     width: 20,
        //     maxHeight: { xs: 20 },
        //     maxWidth: { xs: 20 },
        //     borderRadius: 6
        // },
        '.arrowFont': {
            fontSize: '1rem'
        },
        '& .MuiTypography-root': {
            fontWeight: 400,
            fontSize: '20px',
        },
        '& .MuiButtonBase-root': {
            // padding: '2px 8px',
            // fontSize: 10,
            // fontWeight: 700,
            // minWidth: 30,
            // boxShadow: 'none',
            // borderRadius: 2
        }
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.black,
        // position: 'absolute',
        // right: '40px',
        // top: '12px',
        '& .MuiSvgIcon-root': {
            fontSize: '1.8rem'
        },
        marginRight: '32px'
    },
    '& .MuiCollapse-root': {
        '& .MuiAccordionDetails-root': {
            // padding: 0,
            '& .MuiButtonBase-root': {
                // fontSize: 10,
                // fontWeight: 700,
                // minWidth: 30,
                // padding: '1px 4px',
                // borderRadius: 3
            },
            '.contentBox': {
                // display: 'flex',
                // justifyContent: 'space-between',
            },
        }
    },
    '& .MuiButtonBase-root': {
        // boxShadow: 'none',
        padding: '0 8px'
    }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '58%',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.black,
        borderRadius: '20px',
    }
}))
const temArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export default function Dashboard() {
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
        <Box sx={{ ml: 5 }}>
            <Typography sx={{
                fontSize: '36px',
                fontWeight: 700,
                ml: 1
            }}>{i18n['jobTitles.title']}</Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
                mb: 3
            }}>
                <StyledTextField label="job title" id="search" size="small" />
                <Box>
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
                        sx={{ ml: { xl: 2, sm: 1 } }}
                    >
                        {i18n['jobTitles.broad']}
                    </Button>
                    <Button
                        id="currentAndPast"
                        aria-controls={open ? 'currentAndPast-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDownIcon />}
                        color="redButton"
                        sx={{ ml: { xl: 2, sm: 1 } }}
                    >
                        {i18n['jobTitles.currentAndPast']}
                    </Button>
                    <Button
                        id="approved"
                        aria-controls={open ? 'approved-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDownIcon />}
                        color="redButton"
                        sx={{ ml: { xl: 2, sm: 1 } }}
                    >
                        {i18n['jobTitles.approved']}
                    </Button>
                </Box>

            </Box>

            {temArray.map((item, index) => (
                <StyledAccordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Box className='summaryBox1'>
                            <Typography>Volunteer: Deputy Director</Typography>
                            <Box>
                                <Button variant="contained" color="redButton" sx={{ mr: 1, height: '20px', fontSize: '10px' }}>1</Button>
                                <Button variant="contained" color="redButton" sx={{ opacity: 0.5, height: '20px', fontSize: '10px' }}>6</Button>
                                <IconButton color='lightGreenButton100'>
                                    <FiberManualRecordIcon />
                                </IconButton>
                            </Box>

                        </Box>

                    </AccordionSummary>

                    <AccordionDetails>
                        <Box className='contentBox'>
                            <Typography>Content Volunteer: Deputy Director</Typography>
                        </Box>
                    </AccordionDetails>
                </StyledAccordion>

            ))}

        </Box>
    );
}