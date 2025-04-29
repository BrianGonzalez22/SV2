import * as React from 'react';
import { Grid, Box } from '@mui/material';

export default function MyChartBox(props) {
  const {icon1, title1, chart1,icon2, title2, chart2,icon3, title3, chart3} = props
  return (
    <>
        <Grid container spacing={2}
            sx={{width:'100%', minHeight:'200px', boxShadow: 3, marginBottom: '20px', marginTop:'30px'}}
        >

            <Grid
                item xs={12} sm={6} md={4} lg={4}
                sx={{minHeight: '200px', padding:'20px', borderRight: '1px dotted #d3d3d3',display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
            >
                <Box sx={{marginBottom: '20px', fontWeight:'bold', display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                    <Box sx={{marginRight: '15px'}}>{icon1}</Box>
                    <Box>{title1}</Box>
                </Box>

                <Box sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>{chart1}</Box>

            </Grid>

            <Grid
                item xs={12} sm={6} md={4} lg={4}
                sx={{minHeight: '200px', padding:'20px', borderRight: '1px dotted #d3d3d3',display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
            >
                <Box sx={{marginBottom: '20px', fontWeight:'bold', display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                    <Box sx={{marginRight: '15px'}}>{icon2}</Box>
                    <Box>{title2}</Box>
                </Box>

                <Box sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>{chart2}</Box>

            </Grid>

            <Grid
                item xs={12} sm={6} md={4} lg={4}
                sx={{ minHeight: '200px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                <Box sx={{marginBottom: '20px', fontWeight:'bold', display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                    <Box sx={{marginRight: '15px'}}>{icon3}</Box>
                    <Box>{title3}</Box>
                </Box>

                <Box sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>{chart3}</Box>

            </Grid>

        </Grid>

    </>
  );
}
