import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import {Link} from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'


export default class Targets extends React.Component {
    render() {
        return (
            <Grid container>
                    <Grid item xs="12">                        
                        <h1>Цели</h1>
                        <Button variant="contained" component={Link} to="/targets/edit" >Добавить</Button>                                    
                    </Grid>
                    <Grid item xs="12">
                        <h2>Активные цели</h2>     
                        <Grid container>
                        <Grid item xs={4}>
                            <Card>                                
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Выполнить 10 тренировок 
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <LinearProgress variant="buffer" value="50" />
                                        </Grid>

                                        <Grid item xs={8}>
                                            01.02.2023 - 03.02.2023
                                        </Grid>
                                        <Grid item xs={8}>
                                            Статус: в процессе
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {alert('Удаление!')}}>Удалить</Button>
                                    <Button size="small" component={Link} to={"/target/edit/" }>Редактировать</Button>
                                </CardActions>
                            </Card>
                        </Grid> 
                    </Grid>                                              
                </Grid>
                <Grid item xs="12">
                    <LocalizationProvider dateAdapter={AdapterDayjs} >              
                    <Grid container>
                        <Grid item xs="12">
                            <h2>Завершённые цели</h2>            
                        </Grid>
                        <Grid item xs="12">
                            <Button variant="contained" onClick={ () => { alert("Показываю!")}}>Показать</Button>
                            <DatePicker format="DD.MM.YYYY"/>&nbsp;—&nbsp;
                            <DatePicker format="DD.MM.YYYY"/>                                                
                        </Grid>
                        <Grid item xs="12">
                            <h2>У вас нет завершённых целей</h2>
                        </Grid>
                    </Grid>
                    </LocalizationProvider>

                </Grid>
            </Grid>
        )
    }
}