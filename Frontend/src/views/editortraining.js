import React from 'react'
import withRouter from './withrouter';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import InputLabel from '@mui/material/InputLabel';
import { TextField } from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Link from '@mui/material/Link';

import DataService from '../services/data.js'
import AuthService from '../services/auth.js'

class EditorTraining extends React.Component {
    
    constructor(props) {           
        super(props);
        this.state = {
            formData: {
                name: '',
                description: '',      
                repeat_count: 1,
                repeat_rest_time: 60,          
                file: '',
                exercises: [
                    { id: 1, work_time: 40, completion_rest_time: 20 }, 
                    { id: 2, work_time: 30, completion_rest_time: 20 }
                ] 
            },
            dic1: [],
            dic2: [],
            dic3: [],
            exercises: undefined,             
            selectedExerciseId: undefined,
            totalCalories: 100,
            totalTime: 70
        }

        this.isNew = this.props.params.id === undefined                
    }

    componentDidMount() {
        this.uploadData()
    }
    
    componentDidUpdate() {
        if (JSON.stringify(this.state.formData.exercises) !== this.lastExercisesStr) {
            this.lastExercisesStr = JSON.stringify(this.state.formData.exercises)                        
            
            const totalTime = this.state.formData.exercises.reduce((partialSum, e) => partialSum + e.work_time + e.completion_rest_time, 0);
            
            let totalCalories = 0
            this.state.formData.exercises.forEach(e => {
                const fullInfo = this.state.exercises.find(x => x.id === e.id)                                
                totalCalories += fullInfo.calories_per_hour * (e.work_time / 3600)
            })

            totalCalories = Math.floor(totalCalories)
            this.setState({totalTime, totalCalories})
        }
    }

    // удалить упражнение
    deleteExercise = (i) => {        
        const formData = {...this.state.formData}
        formData.exercises.splice(i, 1)
        this.setState({formData})
    }

    move = (i, delta) => {
        const newpos = i + delta
        if (newpos < 0 || newpos >= this.state.formData.exercises.length) {
            // попытка двинуть элемент за границы массива
            return
        }

        const formData = {...this.state.formData}
        const saved = formData.exercises[newpos]
        formData.exercises[newpos] = formData.exercises[i]
        formData.exercises[i] = saved
        
        this.setState({formData})
    }

    // загрузка данных
    uploadData = () => {
        // const trainingId = this.props.params.id

        // получаю список доступных упражнений
        DataService.exercisesavailable(AuthService.userId, '', 'asc').then((r) => {            
            this.setState({ 
                exercises: r.data,
                defaultExercise: r.data.length > 0 ? r.data[0] : undefined });                   
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });        

        var p1 = DataService.dictionary(1)
        var p2 = DataService.dictionary(2)        
        Promise.all([p1, p2]).then((values) => {
            this.setState({ dic1: values[0].data }, () => {
                this.setState({ dic2: values[1].data }, () => {
                    
                        // если редактирование - загружаю данные по тренировке
                        if (this.isNew)  {
                            return;
                        }
                        
                     /*   DataService.training(exerciseId).then(e => {
                            const d = e.data
                            const fd = { 
                                title: d.title, 
                                description: d.description,
                                calories_per_hour: d.calories_per_hour                            
                            }
                            d.dicRefs.forEach(x => {
                                fd["dic" + x] = 'on'
                            })

                            this.setState({ formData : fd})
                        }, (error) => {                
                            alert(error.response?.data?.error || error.message)
                        });
                        */
                });
            });            
            
        }, (error) => {                     
            alert(error.response?.data?.error || error.message)            
        })                    
    }

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;        
        this.setState({ formData });
    }

    handleFileChange = async (event) => {
        const file = event.target.files[0]
        const base64 = await this.convertBase64(file)        
        const { formData } = this.state;
        formData[event.target.name] = base64
        this.setState({ formData });
    }

    handleExerciseChange = async(event) => {    
        this.setState({selectedExerciseId : event.target.value})
    }

    handleAddExercise = (event) => {
        const formData = {...this.state.formData}        
        formData.exercises.push({id: this.state.selectedExerciseId, work_time: 1, completion_rest_time: 1 })
        this.setState({ formData })        
    }

    setRepeatCount = (v) => {
        const formData = {...this.state.formData}        
        formData.repeat_count = +v
        this.setState({ formData })
    }

    setRepeatRestTime = (v) => {
        const formData = {...this.state.formData}        
        formData.repeat_rest_time = +v
        this.setState({ formData })
    }

    setCompletionRestTime = (i, v) => {
        const formData = {...this.state.formData}        
        formData.exercises[i].completion_rest_time = +v
        this.setState({ formData })
    }

    setWorkTime = (i, v) => {
        const formData = {...this.state.formData}        
        formData.exercises[i].work_time = +v
        this.setState({ formData })
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        let pr = (this.isNew ? 
            DataService.trainingcreate(AuthService.userId, this.state.formData) :
            DataService.trainingupdate(AuthService.userId, this.props.params.id, this.state.formData))
        
        pr.then((r) => {              
            if (this.isNew) {
                alert('Тренировка успешно создана\r\nТеперь вы можете создать ещё одну')
            } else {
                alert('Изменения успешно сохранены')
            }
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });
    }
        
    render() {        
        const msgHeader = this.isNew ? "Новая тренировка" : "Редактируем тренировку"
        const msgSave = this.isNew ? "Создать тренировку" : "Сохранить изменения"

        return (
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '50vh' }}
            >
                <Grid item xs={6}>
                    <h1>{msgHeader}</h1>
                    <ValidatorForm 
                        autoComplete="off" 
                        ref="form"
                        xs="p: 4"
                        onSubmit={this.handleSubmit}                
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextValidator
                                        label="Название тренировки"
                                        name="name"
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                        value={this.state.formData.name}
                                        validators={['required']}
                                        errorMessages={['Обязательное поле']}
                                        />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextValidator
                                        label="Описание"
                                        name="description"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                        value={this.state.formData.description}
                                        validators={['required']}
                                        errorMessages={['Обязательное поле']}
                                        />
                                </Grid>                                
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="подходов"
                                        type="number"
                                        fullWidth
                                        InputProps={{ inputProps: { min: 1, max: 100 } }}
                                        onChange={(e) => this.setRepeatCount(e.target.value)}
                                        value={this.state.formData.repeat_count}                                                    
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="отдых между подходами"
                                        type="number"
                                        fullWidth
                                        InputProps={{ inputProps: { min: 1, max: 100 } }}
                                        onChange={(e) => this.setRepeatRestTime(e.target.value)}
                                        value={this.state.formData.repeat_rest_time}                                                    
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button variant="contained" 
                                        component="label" 
                                        color="primary"
                                        aria-label="upload picture"                                        
                                        fullWidth
                                        sx={{mb: 3}}
                                        onChange={this.handleFileChange}
                                    >
                                            Изображение JPEG&nbsp;
                                            <input hidden accept="image/jpeg" type="file" name="file" />
                                            <PhotoCamera />
                                    </Button>
                                </Grid>                               
                            </Grid>

                            <Grid container spacing={2}>                                
                                <Grid item xs={3}>                                    
                                </Grid>
                                <Grid item xs={3}>
                                    <h3>Время</h3>
                                </Grid>
                                <Grid item xs={3}>                                    
                                    <h3>Отдых</h3>
                                </Grid>
                            </Grid>
                            
                            {this.state.formData.exercises?.length === 0 && <h1>У вас пока нет упражнений :(</h1>}

                            {this.state.formData.exercises.map((e, i) => {
                                    const exercise = this.state.exercises?.find(s => s.id === e.id)
                                    return <Grid container xs={12}>
                                            <Grid item xs={3}>                                        
                                                <h3>{exercise?.title}</h3>
                                            </Grid>  
                                            <Grid item xs={3}>                                        
                                                <TextField
                                                    label="секунды"
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 1, max: 100 } }}
                                                    onChange={(e) => this.setWorkTime(i, e.target.value)}
                                                    value={e.work_time}                                                    
                                                />
                                            </Grid>  
                                            <Grid item xs={3}>                                        
                                                <TextField
                                                    label="секунды"
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 1, max: 100 } }}
                                                    onChange={(e) => this.setCompletionRestTime(i, e.target.value)}
                                                    value={e.completion_rest_time}                                                    
                                                />
                                            </Grid>  
                                            <Grid item xs={3}>
                                                <Grid container xs={12}>
                                                    <Grid item xs={8}>
                                                        <Button size="small" onClick={() => this.deleteExercise(i)}>УДАЛИТЬ</Button>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        {i > 0 && <Link href="#" underline="none" onClick={() => this.move(i, -1)}>↑</Link>}
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        {i < this.state.formData.exercises.length - 1 && <Link href="#" underline="none" onClick={() => this.move(i, 1)}>↓</Link>}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>                                                                              
                            })}                            

                            <Grid container spacing={2}>                                
                                <Grid item xs={12}>                                    
                                    <InputLabel id="exercise-label">Упражнение</InputLabel>
                                    <Select           
                                            labelId="exercise-label"
                                            sx={{minWidth: 200}}                   
                                            id="exercise-select"                                            
                                            label="Упражнение"
                                            onChange={this.handleExerciseChange}                                          
                                    >
                                        {this.state?.exercises?.map(e => 
                                            <MenuItem value={e.id}>{e.title}</MenuItem>
                                        )}
                                    </Select>&nbsp;                                    
                                    <Button variant="contained" 
                                        component="label" 
                                        color="primary"                                        
                                        sx={{mb: 3}}
                                        disabled={this.state.selectedExerciseId ? '' : 'disabled'}
                                        onClick={this.handleAddExercise}                                                                                
                                    >
                                        Добавить
                                    </Button>                                    
                                </Grid>                                
                            </Grid>

                            <Grid container spacing={2}>                                
                                <Grid item xs={12}>
                                    Время тренировки: {Math.floor(this.state.totalTime / 60)} мин. {this.state.totalTime % 60} сек.
                                </Grid>
                                <Grid item xs={12}>
                                    Расход ккал: {this.state.totalCalories}
                                </Grid>
                            </Grid>
                                                      
                            <Grid container spacing={2}>                                
                                <Grid item xs={4}>
                                    <h2>Тип</h2>
                                    <FormGroup>
                                    {this.state.dic1?.map(e => {
                                        return <FormControlLabel name={"dic" + e.id} onChange={this.handleChange} control={
                                            <Checkbox checked={this.state.formData["dic" + e.id] === 'on' ? 'checked' : ''} />} label={e.value} />
                                    })}
                                    </FormGroup>
                                </Grid>

                                <Grid item xs={4}>
                                    <h2>Части тела</h2>
                                    <FormGroup>
                                    {this.state.dic2?.map(e => {
                                        return <FormControlLabel name={"dic" + e.id} onChange={this.handleChange} control={
                                            <Checkbox checked={this.state.formData["dic" + e.id] === 'on' ? 'checked' : ''} />} label={e.value} />
                                    })}
                                    </FormGroup>
                                </Grid>                                
                            </Grid>                            

                            <Button variant="outlined" color="secondary" type="submit">{msgSave}</Button>             
                    </ValidatorForm>
                </Grid>
                
                <Grid container spacing={2} style={{ minHeight: '10vh' }}>
                </Grid>

            </Grid>   
        )
    }
}

export default withRouter(EditorTraining);