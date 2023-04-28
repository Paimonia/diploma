import React from 'react'
import withRouter from './withrouter';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import DataService from '../services/data.js'
import AuthService from '../services/auth.js'

class EditorExercise extends React.Component {
    
    constructor(props) {           
        super(props);
        this.state = {
            formData: {
                title: '',
                description: '',
                calories_per_hour: '100',
                file: ''
            },
            dic1: [],
            dic2: [],
            dic3: []            
        }

        this.isNew = this.props.params.id === undefined                
    }

    componentDidMount() {
        this.uploadData()
    }

    // загрузка данных
    uploadData = () => {
        const exerciseId = this.props.params.id
        var p1 = DataService.dictionary(1)
        var p2 = DataService.dictionary(2)
        var p3 = DataService.dictionary(3)
        Promise.all([p1, p2, p3]).then((values) => {
            this.setState({ dic1: values[0].data }, () => {
                this.setState({ dic2: values[1].data }, () => {
                    this.setState({ dic3: values[2].data }, () => {
                        // если редактирование - загружаю данные по упражнению                         
                        if (this.isNew)  {
                            return;
                        }
                        
                        DataService.exercise(exerciseId).then(e => {
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

                    });
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
            DataService.exercisecreate(AuthService.userId, this.state.formData) :
            DataService.exerciseupdate(AuthService.userId, this.props.params.id, this.state.formData))
        
        pr.then((r) => {              
            if (this.isNew) {
                alert('Упражнение успешно создано\r\nТеперь вы можете создать ещё одно')
            } else {
                alert('Изменения успешно сохранены')
            }
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });
    }
        
    render() {        
        const msgHeader = this.isNew ? "Новое упражнение" : "Редактируем упражнение"
        const msgSave = this.isNew ? "Создать упражнение" : "Сохранить изменения"

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
                                        label="Название упражнения"
                                        name="title"
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                        value={this.state.formData.title}
                                        validators={['required']}
                                        errorMessages={['Обязательное поле']}
                                        />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextValidator
                                        label="Описание"
                                        name="description"
                                        multiline
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
                                    <Button variant="contained" 
                                        component="label" 
                                        color="primary"
                                        aria-label="upload picture"                                        
                                        sx={{mb: 3}}
                                        onChange={this.handleFileChange}
                                    >
                                            Изображение JPEG&nbsp;
                                            <input hidden accept="image/jpeg" type="file" name="file" />
                                            <PhotoCamera />
                                    </Button>
                                </Grid>

                                <Grid item xs={6}>
                                    <TextValidator
                                        label="Ккал/час"
                                        name="calories_per_hour"                                                                
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                        value={this.state.formData.calories_per_hour}
                                        validators={['required']}
                                        errorMessages={['Обязательное поле']}
                                        />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>

                            <Grid item xs={6}>
                                    <Button variant="contained" 
                                        component="label" 
                                        color="primary"
                                        aria-label="upload picture"                                        
                                        sx={{mb: 3, width: '100%'}}
                                        onChange={this.handleFileChange}
                                    >
                                            Видео MP4&nbsp;
                                            <input hidden accept="video/mp4" type="file" name="video" />
                                            <PhotoCamera />
                                    </Button>
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

                                <Grid item xs={4}>
                                    <h2>Инвентарь</h2>
                                    <FormGroup>
                                    {this.state.dic3?.map(e => {
                                        return <FormControlLabel name={"dic" + e.id} onChange={this.handleChange} control={
                                            <Checkbox checked={this.state.formData["dic" + e.id] === 'on' ? 'checked' : ''} />} label={e.value} />
                                    })}
                                    </FormGroup>
                                </Grid>
                            </Grid>

                            <Button variant="outlined" color="secondary" type="submit">{msgSave}</Button>             
                    </ValidatorForm>
                </Grid>
            </Grid>   
        )
    }
}

export default withRouter(EditorExercise);