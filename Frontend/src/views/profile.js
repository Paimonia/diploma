import React from 'react'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import AuthService from '../services/auth.js';
import DataService from '../services/data.js';

export default class Profile extends React.Component {
    
    constructor(props) {        
        super(props);
        this.state = {
            formData: {
                email: '',
                password1: '',
                password2: '',
                firstname: '',
                lastname: ''            
            }
        };        
    }

    componentDidMount() {        
        // запрашиваю информацию по профилю
        DataService.profile(AuthService.userId).then((r) => {
            const { formData } = this.state;                        
            formData.email = r.data.email
            formData.firstname = r.data.firstname
            formData.lastname = r.data.lastname
            formData.password1 = r.data.password
            formData.password2 = r.data.password
            this.setState({ formData });
        }, (error) => {                
            alert(error.response?.data?.error || error.message)
        });

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return value === this.state.formData.password1
        });
    }

    componentWillUnmount() {     
        ValidatorForm.removeValidationRule('isPasswordMatch');
    }

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { email, password1, firstname, lastname } = this.state.formData;  
        DataService.updateProfile(AuthService.userId, email, password1, firstname, lastname)
            .then((response) => {                                 
                alert("Пользователь успешно обновлён")                
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
            <h2>Профиль</h2>
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
                    label="Имя"
                    name="firstname"
                    onChange={this.handleChange}                                                                                
                    sx={{mb: 3}}                    
                    value={this.state.formData.firstname}                    
                 />
                 <TextValidator
                    label="Фамилия"
                    name="lastname"
                    onChange={this.handleChange}                                                                                
                    sx={{mb: 3}}                    
                    value={this.state.formData.lastname}                    
                 />
                 <TextValidator
                    label="Пароль"
                    name="password1"
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.formData.password1}
                    validators={['required']}
                    errorMessages={['Обязательное поле']}
                    sx={{mb: 3}}
                 />
                  <TextValidator
                    label="Повтор пароля"
                    name="password2"
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.formData.password2}
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['Пароли должны совпадать', 'Обязательное поле']}
                    sx={{mb: 3}}
                 />
                 <Button variant="outlined" color="secondary" type="submit">Обновить</Button>             
            </ValidatorForm>  
        </Grid>
        </Grid>      
        )
    }
}