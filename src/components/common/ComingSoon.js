import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

export default function ComingSoon() {

    return (
        <Grid container sx={{ p: 3, height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* <DonutSmallIcon /> */}
                <Typography sx={{
                    fontSize: '48px',
                    fontWeight: 700,
                    color: 'purpleButton.main'
                }}>
                    <span>Coming Soon...</span>
                </Typography>
            </Box>

        </Grid>

    )
}