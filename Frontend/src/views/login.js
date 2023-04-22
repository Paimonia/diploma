import React from 'react'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import AuthService from '../services/auth.js';

export default class Login extends React.Component {
    
    constructor(props) {        
        super(props);
        this.state = {
            formData: {
                email: '',
                password: ''                
            }
        };        
    }    

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }

    handleSubmit = (event) => {
        event.preventDefault()
        AuthService.login(this.state.formData.email, this.state.formData.password)
            .then((response) => {                                                 
                window.location = '/'
            }, (error) => {                
                alert(error.response?.data?.error || error.message)
            });            
    }

    render() {
        return (
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '50vh' }}
    >
        <Grid item xs={3}>
            <h2>Авторизация</h2>
            <ValidatorForm 
                autoComplete="off" 
                ref="form"
                onSubmit={this.handleSubmit}                
                >            
                <TextValidator
                    label="Email"
                    name="email"
                    onChange={this.handleChange}                                                                                
                    sx={{mb: 3}}                    
                    value={this.state.formData.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['Обязательное поле', 'email некорректен']}
                 />
                 <TextValidator
                    label="Пароль"
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.formData.password}
                    validators={['required']}
                    errorMessages={['Обязательное поле']}
                    sx={{mb: 3}}
                 />                  
                 <Button variant="outlined" color="secondary" type="submit">Авторизация</Button>             
            </ValidatorForm>  
        </Grid>
        </Grid>      
        )
    }
}