import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import locale from '../../../i18n/locale'
import BuildSearch from './BuildSearch'
import JobTitles from './JobTitles'
import { useOutletContext, Outlet } from 'react-router-dom'

// const componentNames = {
//     buildSearch: BuildSearch,
//     jobTitles: JobTitles
// };

export default function Search() {
    const i18n = locale.en;
    const theme = useTheme()
    // const searchMenu = useOutletContext();
    // const SomeComponent = componentNames[searchMenu?.subMenu || 'buildSearch'];

    return (
        <Box>
            <Outlet />
        </Box>
    );
}