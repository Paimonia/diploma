import React from 'react'
import Grid from '@mui/material/Grid'

export default class Home extends React.Component {
    render() {
        return (
            <div style={{padding: 10}}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <h1>FitMe - ваш лучший помощник в мире фитнесса</h1>
                        <h3>
                            FitMe обеспечивает поддержку и мотивацию, необходимые людям для достижения своих целей в области хорошего самочувствия и контроля над своим здоровьем - в любое время, в любом месте, в любом возрасте, с любым уровнем опыта. Фитнес, осознанность, профилактика
                        </h3>
                    </Grid>
                    <Grid item xs={6}  > 
                        <img src="/fitme-female.avif" width="100%" height="auto" alt="fitme female" />                                           
                    </Grid>
                </Grid>
              
            </div>
        )
    }
}