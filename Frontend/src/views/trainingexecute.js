import React from 'react'
import withRouter from '../shared/withrouter'
import Grid from '@mui/material/Grid'
import ReactPlayer from 'react-player';

import AuthService from '../services/auth.js'
import DataService from '../services/data.js'

class TrainingExecute extends React.Component {

    constructor(props) {           
        super(props);
        this.state = { 
            training: {},
            exercises: undefined,
            currenttrainingexercise: undefined,
            currentexercise: undefined             
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
                    const fte = this.state.training.exercises[0]   
                    this.setState({
                        currenttrainingexercise : fte,
                        currentexercise : this.state.exercises.find(e => e.id === fte.exercise_id) 
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
                <h1>Тренировка {this.state.training.name}</h1>            
                <Grid container>                    
                    <Grid item xs="4">
                        <Grid container>
                            <Grid container>
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
                            return (
                            <Grid container style={{ backgroundColor: e.id === this.state.currenttrainingexercise?.id ? '#1976d2' : '' }}>
                                <Grid item xs="6">
                                    {ex?.title}
                                </Grid>
                                <Grid item xs="3">
                                    {e.worked_time} 
                                </Grid>
                                <Grid item xs="3">
                                    {e.work_time} 
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
                        <h2>Осталось {this.state.currenttrainingexercise?.work_time - this.state.currenttrainingexercise?.worked_time} сек.</h2>                        
                        <ReactPlayer 
                                    width='100%' 
                                    loop='true'
                                    playing='true'
                                    playsinline='true' 
                                    url={this.state.currentexercise? `http://localhost:4000/videos/exercises/${this.state.currentexercise.id}.mp4` : ''} 
                        />
                    </Grid>}
                </Grid>
            </div>           
        )
    }
}

export default withRouter(TrainingExecute);