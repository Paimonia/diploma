import React from 'react'
import Grid from '@mui/material/Grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Button from '@mui/material/Button'
import { Pie, Line } from 'react-chartjs-2'
import {
    Chart, 
    ArcElement, 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend } from 'chart.js'

export default class Stats extends React.Component {

    constructor(props) {        
        super(props);
        this.state = {
            piechart: {
                labels: ["Приседания", "Отжимания"],
                datasets: [
                    {
                      data: [72, 25],
                      backgroundColor: ["#003f5c", "#58508d"]
                    }
                  ]
            },
            linear1: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
            },
            linear2: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
            }
        }

        ChartJS.register(
            ArcElement,
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend
          );
    }    


    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} >    
                <Grid container>
                    <Grid item xs="12">
                        <h1>Статистика</h1>
                    </Grid>

                    <Grid item xs="2">
                        Показать от
                    </Grid>
                    <Grid item xs="10">
                        <DatePicker format="DD.MM.YYYY"/>&nbsp;—&nbsp;
                        <DatePicker format="DD.MM.YYYY"/>
                        <Button variant="contained" onClick={ () => { alert("Показываю!")}}>Показать</Button>                                   
                    </Grid>

                    <Grid item xs="2">
                        Сравнить с
                    </Grid>
                    <Grid item xs="10">
                        <DatePicker format="DD.MM.YYYY"/>&nbsp;—&nbsp;
                        <DatePicker format="DD.MM.YYYY"/>
                        <Button variant="contained" onClick={ () => { alert("Сравниванию!")}}>Сравнить</Button>   
                    </Grid>

                    <Grid item xs="6">
                        <Line options={{
                            responsive: true,
                            plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Тренировок по дням',
                                    },
                                }
                            }} 
                            data={{
                                labels: this.state.linear1.labels,
                                datasets: [
                                {
                                    label: 'Dataset 1',
                                    data: this.state.linear1.labels.map((e, i) => 5*i),
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                    label: 'Dataset 2',
                                    data: this.state.linear1.labels.map((e, i) => 300*i),
                                    borderColor: 'rgb(53, 162, 235)',
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                },
                                ],
                            }} />


                        <Line options={{
                            responsive: true,
                            plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Расход энергии по дням',
                                    },
                                }
                            }} 
                            data={{
                                labels: this.state.linear2.labels,
                                datasets: [
                                {
                                    label: 'Dataset 1',
                                    data: this.state.linear2.labels.map((e, i) => i * 100),
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                    label: 'Dataset 2',
                                    data: this.state.linear2.labels.map((e, i) => i * 50),
                                    borderColor: 'rgb(53, 162, 235)',
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                },
                                ],
                            }} />

                    </Grid>
                    <Grid item xs="6">
                       <Grid container>
                            <Grid item xs="4">
                                <Pie
                                    options={{
                                        width: "400px",
                                        height: "400px"
                                    }}
                                    data={{
                                        labels: this.state.piechart.labels,
                                        datasets: this.state.piechart.datasets
                                    }}
                                />
                            </Grid>
                            <Grid item xs="8">
                                <Grid container>
                                    <Grid item xs="6">
                                        Всего тренировок
                                    </Grid>
                                    <Grid item xs="6">
                                        3
                                    </Grid>

                                    <Grid item xs="6">
                                        В среднем в день
                                    </Grid>
                                    <Grid item xs="6">
                                        1
                                    </Grid>

                                    <Grid item xs="6">
                                        Средний расход ккал
                                    </Grid>
                                    <Grid item xs="6">
                                        100
                                    </Grid>

                                    <Grid item xs="6">
                                        Планов выполнено
                                    </Grid>
                                    <Grid item xs="6">
                                        0
                                    </Grid>
                                </Grid>
                            </Grid>
                       </Grid>
                    </Grid>
                                            
                </Grid>
            </LocalizationProvider>
        )
    }
}