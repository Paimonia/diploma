import React from 'react'
import withRouter from '../shared/withrouter'
import Grid from '@mui/material/Grid'
import ReactPlayer from 'react-player'
import Button from '@mui/material/Button'

import AuthService from '../services/auth.js'
import DataService from '../services/data.js'

class TrainingExecute extends React.Component {

    constructor(props) {           
        super(props);
        this.state = { 
            training: {},
            exercises: undefined,
            currenttrainingexercise: undefined,
            currentexercise: undefined,
            nextexercise: undefined,
            repeat_count: 1,
            isResting: false         
        }
        
        this.trainingId =  this.props.params.id 
    }

    componentDidMount() {
        this.uploadData()
    }

    // загрузка данных
    uploadData = () => {        

        var p1 = DataService.exercisesavailable(AuthService.userId, '', 'desc')
        var p2 = DataService.training(this.trainingId)
        Promise.all([p1, p2]).then((values) => {
            this.setState({ exercises: values[0].data }, () => {
                this.setState({ training: values[1].data }, () => {
                    alert(JSON.stringify(this.state))
                    const fte = this.state.training.exercises.length >= 0 ? this.state.training.exercises[0] : undefined  
                    const nte = this.state.training.exercises.length >= 1 ? this.state.training.exercises[1] : undefined 
                    this.setState({
                        currenttrainingexercise : fte,
                        currentexercise : this.state.exercises.find(e => e.id === fte?.exercise_id),
                        nextexercise : this.state.exercises.find(e => e.id === nte?.exercise_id),                         
                    })                
                })
            })
        }, (error) => {         
            alert(error.response?.data?.error || error.message)            
        })
    }

    render() {
        return (
            <div>
                  <Grid container>                    
                    <Grid item xs="4">                        
                        <Grid container>
                            <Grid container>
                                <Grid item xs="12">
                                    <h1>Тренировка {this.state.training.name}</h1>  
                                    <h2>Повтор: {this.state.repeat_count} / {this.state.training.repeat_count}</h2>                       
                                </Grid>
                                <Grid item xs="4">
                                    <h3>Упражнение</h3>
                                </Grid>
                                <Grid item xs="4">
                                    <h3>Выполнено сек.</h3>
                                </Grid>
                                <Grid item xs="4">
                                    <h3>Всего сек.</h3>
                                </Grid>                                
                            </Grid>
                        {this.state.training?.exercises?.map(e => {
                            const ex = this.state.exercises.find(z => e.exercise_id === z.id)
                            const exerciseRowStyle = this.state.isResting ? undefined : { backgroundColor: e.id === this.state.currenttrainingexercise?.id ? '#1976d2' : '' }
                            const restRowStyle = !this.state.isResting ? undefined :  { backgroundColor: e.id === this.state.currenttrainingexercise?.id ? '#1976d2' : '' }                            
                            return (
                            <Grid container>
                                <Grid item xs="6" style={exerciseRowStyle}>
                                    {ex?.title}
                                </Grid>
                                <Grid item xs="3" style={exerciseRowStyle}>
                                    {e.worked_time} 
                                </Grid>
                                <Grid item xs="3" style={exerciseRowStyle}>
                                    {e.work_time} 
                                </Grid>
                                <Grid item xs="6" style={restRowStyle}>
                                    Отдых
                                </Grid>
                                <Grid item xs="3" style={restRowStyle}>
                                </Grid>
                                <Grid item xs="3" style={restRowStyle}>
                                    {e.completion_rest_time} 
                                </Grid>
                            </Grid>
                            )
                        })}
                        </Grid>
                    </Grid>
                    <Grid xs="1">                        
                    </Grid>
                    {this.state.currenttrainingexercise && <Grid xs="7">
                        <h2>{this.state.currentexercise?.title}</h2>
                        <p>{this.state.currentexercise?.description}</p>
                        <Grid container>
                            <Grid item xs="8">
                                <h2>Осталось {this.state.currenttrainingexercise?.work_time - this.state.currenttrainingexercise?.worked_time} сек.</h2>                                                
                                <ReactPlayer 
                                            width='90%' 
                                            loop='true'
                                            playing='true'
                                            playsinline='true' 
                                            url={this.state.currentexercise? `http://localhost:4000/videos/exercises/${this.state.currentexercise.id}.mp4` : ''} 
                                />
                            </Grid>
                            <Grid item xs="4">
                                <h2>Следующее упражнение</h2>
                                <ReactPlayer 
                                            width='90%' 
                                            playsinline='false' 
                                            url={this.state.nextexercise? `http://localhost:4000/videos/exercises/${this.state.nextexercise.id}.mp4` : ''} 
                                />
                            </Grid>
                        </Grid>
                    </Grid>}
                </Grid>
                <Grid container>
                    <Button variant="contained">СТАРТ</Button>&nbsp;
                    <Button variant="contained">СТОП</Button>&nbsp;
                    <Button variant="contained">ПАУЗА</Button>                    
                </Grid>
            </div>           
        )
    }
}

export default withRouter(TrainingExecute);