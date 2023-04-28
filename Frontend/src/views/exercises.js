import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {Link} from 'react-router-dom'

import DataService from '../services/data.js'
import AuthService from '../services/auth.js'
import { TextField } from '@mui/material';

export default class Exercices extends React.Component {

    constructor(props) {        
        super(props);
        this.state = {
            exercises: null,
            order: 'desc',
            filter: ''
            }
    }    

    deleteExercise = (id) => {
        DataService.exercisedelete(id).then((r) => {            
            alert('Упражнение успешно удалено')
            this.uploadData()
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });        
    }
    
    uploadData = () => {
        DataService.exercisesavailable(AuthService.userId, this.state.filter, this.state.order).then((r) => {            
            this.setState({ exercises: r.data });
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });        
    }

    componentDidMount() {
        // запрашиваю информацию о доступных упражнениях
        this.uploadData()        
    }

    setFilter = (value, callback) => {
        this.setState({ filter: value }, callback)
    }

    filterChange = (event => {
        this.setFilter(event.target.value, () => this.uploadData())        
    })    

    setOrder = (value, callback) => {
        this.setState({order: value}, callback)
    }

    orderChange = (event => {        
        this.setOrder(event.target.value, () => this.uploadData())        
    })    
    
    render() {
        return (
            <div>                                
                <h1>Упражнения</h1>                          
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                            <Button variant="contained" sx={{m: 2}} component={Link} to="/exercise/edit">Добавить</Button>
                            <TextField                                  
                                sx={{m: 2}}
                                label="Поиск" 
                                variant="outlined" 
                                onChange={this.filterChange}
                                />
                            <Select 
                                sx={{m: 2}}
                                label="Направление сортировки"
                                value={this.state.order}
                                onChange={this.orderChange}
                            >
                                <MenuItem value="asc">дате ↑</MenuItem>
                                <MenuItem value="desc" selected>дате ↓</MenuItem>                            
                            </Select>
                    </Grid>
                    
                    {this.state.exercises?.length === 0 && 
                        <Grid item xs={12}>
                            <h2>По вашему запросу ничего не найдено :(</h2>
                        </Grid>}

                    {this.state.exercises?.map(e => 
                        <Grid item xs={4}>
                            <Card>
                                <CardMedia                       
                                    image={"http://localhost:4000/images/exercises/" + e.id + ".jpg"}
                                    title={e.title}
                                    sx={{height: 150, padding: "1em 1em 0 1em", objectFit: "scaleDown" }}
                                />
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {e.title} 
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            {e.calories_per_hour} ккал/час
                                        </Grid>
                                    </Grid>

                                    <Typography variant="body2" color="text.secondary">
                                        {e.description}
                                    </Typography>                                
                                </CardContent>
                                <CardActions>
                                    {e.user_id && <Button size="small" onClick={() => this.deleteExercise(e.id)}>Удалить</Button>}
                                    {e.user_id && <Button size="small" component={Link} to={"/exercise/edit/" + e.id}>Редактировать</Button>}
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                  
                </Grid>
            </div>
        )
    }
}