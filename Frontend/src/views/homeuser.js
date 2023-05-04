import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import DataService from '../services/data.js'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {Link} from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Modal from '@mui/material/Modal'
import AuthService from '../services/auth.js'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export default class HomeUser extends React.Component {

    constructor(props) {           
        super(props);
        this.state = {
            startDate: dayjs(Date.now()),
            currentDate: dayjs(Date.now()),
            endDate: dayjs(Date.now()).add(7, 'day'),
            trainings: undefined,
            trainingsavailable: [],
            selectedTrainingId: 1,
            addTrainingModalIsOpen: false
        }
    }

    uploadData = () => {
        
        // запрашиваю список запланированных тренировок
        DataService.trainingsplanned(AuthService.userId, this.state.startDate, this.state.endDate).then((r) => {  
            const trainings = r.data
            trainings.forEach(t => {                
                const worktime = t.exercises?.reduce((a, b) => a + b.work_time, 0)
                const workedtime = t.exercises?.reduce((a, b) => a + b.worked_time, 0)                
                t.progress = workedtime * 100 / worktime
            })                                 
            this.setState({ 
                trainings: r.data 
            });
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        })

        // запрашиваю список доступных тренировок
        DataService.trainingsavailable(AuthService.userId, '', 'desc').then((r) => {                                  
            this.setState({ 
                trainingsavailable: r.data,
                selectedTrainingId: r.data.length >= 0 ? r.data[0].id : 1 
            });
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });  
    }

    componentDidMount() {
        this.uploadData()
    }

    handleStartDateChange = (value) => {
        this.setState({ startDate: value}, () => this.uploadData())
    }

    handleEndDateChange = (value) => {
        this.setState({ endDate: value}, () => this.uploadData())
    }

    handleCurrentDateChange = (value) => {
        this.setState({ currentDate: value}, () => this.uploadData())
    }

    handleOpen = () => {
        this.setState({ addTrainingModalIsOpen: true})
    }

    handleClose = () => {
        this.setState({ addTrainingModalIsOpen: false})
    }
    
    addTraining = () => {
        DataService.trainingplanforuser(
            AuthService.userId, 
            this.state.selectedTrainingId, 
            new Date(this.state.currentDate)).then(e => {
                alert('Тренировка была добавлена в календарь пользователя')
                this.handleClose()
            }, (error) => {  
                alert(error.response?.data?.error || error.message)
                this.handleClose()
            });
    }

    handleTrainingChange = (event) => {        
        this.setState({ selectedTrainingId: event.target.value }, () => this.uploadData())        
    }

    deleteTraining = (id) => {
        DataService.trainingdelete(id).then((r) => {            
            alert('Тренировка успешно удалена')
            this.uploadData()
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });        
    }

    render() {
        return (             
            <LocalizationProvider dateAdapter={AdapterDayjs} >  
                <Grid container>
                    <Grid item xs="12">
                        <h1>Календарь</h1>            
                    </Grid>
                    <Grid item xs="12">
                        <Button variant="contained" sx={{m: 2}} onClick={() => this.uploadData()}>Показать</Button>
                        <DatePicker value={this.state.startDate} onChange={this.handleStartDateChange} format="DD.MM.YYYY"/>&nbsp;—&nbsp;
                        <DatePicker value={this.state.endDate} onChange={this.handleEndDateChange} format="DD.MM.YYYY"/>                                                
                    </Grid>
                </Grid>

                {this.state.trainings?.length === 0 && 
                    <Grid container>
                        <h1>У вас пока нет тренировок</h1>
                    </Grid>}

                <Grid container spacing={2}>
                {this.state.trainings?.map(t => { return (
                    <Grid item xs={4}>
                        <Card>
                            <CardMedia                       
                                image={"http://localhost:4000/images/trainings/" + t.id + ".jpg"}
                                title={t.name}
                                sx={{height: 150, padding: "1em 1em 0 1em", objectFit: "scaleDown" }}
                            />
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={8}>                                            
                                        <Typography variant="h5" color="text.primary">
                                            {t.name}
                                        </Typography>   
                                    </Grid>
                                    <Grid item xs={4} container justifyContent="flex-end">                                            
                                            {new Date(t.start_date).toLocaleDateString("ru-RU")}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LinearProgress variant="buffer" value={t.progress} />
                                    </Grid>
                                </Grid>                                
                            </CardContent>                          

                            <CardActions>
                                {t.user_id && <Button size="small" onClick={() => this.deleteTraining(t.id)}>Удалить</Button>}
                                {t.user_id && <Button size="small" component={Link} to={"/training/execute/" + t.id}>Продолжить</Button>}
                            </CardActions>                            
                        </Card>

                    </Grid>
                )})}
                </Grid>
    
                <Grid container style={{ minHeight: '2vh' }}>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button variant="contained" sx={{m: 2}} onClick={() => this.handleOpen()}>Добавить</Button>
                    </Grid>
                </Grid>

                <Modal
                    open={this.state.addTrainingModalIsOpen}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Grid container spacing={2}>
                            <Grid item sx={6}>
                                <DatePicker value={this.state.currentDate} onChange={this.handleCurrentDateChange}/>
                            </Grid>
                            <Grid item sx={6}>
                                <Select           
                                            sx={{minWidth: 200}}
                                            id="trainings-label"
                                            value={this.state.selectedTrainingId}
                                            label="Тренировка"
                                            onChange={this.handleTrainingChange}
                                    >
                                        {this.state?.trainingsavailable?.map(e => 
                                            <MenuItem value={e.id}>{e.name}</MenuItem>
                                        )}
                                </Select>
                            </Grid>
                            <Grid item sx={12}>
                                <Button variant="contained" sx={{m: 2}} onClick={() => this.addTraining()}>Добавить</Button>
                                <Button variant="contained" sx={{m: 2}} onClick={() => this.handleClose()}>Отмена</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>                                                        

            </LocalizationProvider>
        )
    }
}