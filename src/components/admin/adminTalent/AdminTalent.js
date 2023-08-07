import * as React from 'react';
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box';
import locale from '../../../i18n/locale'


export default function AdminTalent() {
    const i18n = locale.en;

    return (
        <Box>
            <Outlet />
        </Box>
    );
}