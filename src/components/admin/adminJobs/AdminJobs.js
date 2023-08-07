import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import locale from '../../../i18n/locale'
import { useOutletContext, Outlet } from 'react-router-dom'

// const componentNames = {
//     activeJobs: ActiveJobs,
//     pausedJobs: ActiveJobDetail
// };

export default function AdminJobs() {
    const i18n = locale.en;
    const theme = useTheme()
    // const searchMenu = useOutletContext();
    // const SomeComponent = componentNames[searchMenu?.subMenu || 'activeJobs'];

    return (
        <Box>
            <Outlet />
        </Box>
    );
}