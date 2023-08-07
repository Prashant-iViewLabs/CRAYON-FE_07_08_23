import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import locale from '../../../i18n/locale'
import Accordion from '@mui/material/Accordion';
import ManageJob from '../../employer/myJobs/ManageJob';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import JobCard from './JobCard';

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '& .MuiButtonBase-root': {
        fontSize: 16,
        fontWeight: 700,
        minWidth: 47,
        padding: '2px 4px',
        borderRadius: 3,
        height: '31px',
        boxShadow: 'none'
    },
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginTop: '4px',
    borderRadius: '5px',
    position: 'unset',
    '& .MuiAccordionSummary-root': {
        // alignItems: 'start'
    },
    '& .MuiAccordionSummary-content': {
        flexDirection: 'column',
        // margin: 0,
        '.summaryBox': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginRight: '8px',
            '& .MuiButtonBase-root': {
                fontSize: 10,
                fontWeight: 700,
                minWidth: 29,
                padding: '2px 8px',
                // borderRadius: 3,
                height: '20px',
                boxShadow: 'none'
            }
        },
        '.summaryBoxContent': {
            display: 'flex',
            alignItems: 'center'
        },
        '.profileAvatar': {
            height: 20,
            width: 20,
            borderRadius: 6
        },

        '& .MuiTypography-root': {
            // fontWeight: 700,
            // fontSize: '20px',
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
        // marginRight: '32px',
        // position: 'absolute',
        // right: '40px',
        // top: '12px',
        '& .MuiSvgIcon-root': {
            fontSize: '1.8rem'
        },

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
        padding: '0 16px'
    }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: '40%',
    marginRight: '16px',
    borderRadius: '20px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.black
    }
}))
const JOB = {
    id: '004',
    name: 'Mike',
    logo: '',
    job: 'Lead Developer',
    description: 'Ozow Payments',
    status: {
        label: 'interview',
        color: 'purpleButton'
    },
    crayonComfort: true,
    address: 'Cape Town, South Africa',
    salary: 'R90,000pm',
    experience: '6 years',
    workType: 'remote',
    jobType: 'full-time',
    date: '25 Nov 2022',
    days: '42 days'
}
export default function ActiveJobDetail() {
    const i18n = locale.en;
    const theme = useTheme()

    return (
        <Box>
            <HeaderBox >
                <Button variant="contained" color="orangeButton" sx={{ mr: 1, borderRadius: '5px', pa: 0 }}>004</Button>
                <Typography sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    mr: 1
                }}>ozow</Typography>
                <Typography sx={{
                    fontSize: '36px',
                    fontWeight: 700,
                    mr: 1
                }}>Lead Developer</Typography>
                <Typography sx={{
                    fontSize: '36px',
                    fontWeight: 400,
                }}>Ozow Payments </Typography>

            </HeaderBox>

            <JobCard jobContent={JOB} />

            <Box sx={{
                mt: 2
            }}>
                <StyledSelect
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'stack' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Quick stack (all columns)</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
                <StyledSelect
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'filter' }}
                    size="small">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Quick filter (all columns)</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </StyledSelect>
            </Box>
            <Box sx={{ mt: 1, overflowX: 'auto', minHeight: '69vh' }}>
                <ManageJob />
            </Box>

        </Box>
    );
}