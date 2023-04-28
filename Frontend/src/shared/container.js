import React from 'react'
import {Link} from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import ListItemText from '@mui/material/ListItemText'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AuthService from '../services/auth.js';

export default class Container extends React.Component {
    

    constructor(props) {
        super()
        this.state =  {
            menuOpen: false
        }

        this.pages = [
            {title: "Главная", link: "/"}, 
            {title: "Упражнения", link: "/exercises"}, 
            {title: "Тренировки", link: "/trainings"},
            {title: "Планы", link: "/plans"},
            {title: "Цели", link: "/targets"},
            {title: "Статистика", link: "/stats"},        
        ];
    }

    logout = () => {
        AuthService.logout()
        window.location = "/"
    }

    sidebar = () => {
        return (<Drawer open={this.state.menuOpen} onClose={() => { this.setState({ menuOpen: false })}}>
             {this.pages.map((page) => (                
                    <ListItemButton component={Link} to={page.link}>
                            <ListItemText primary={page.title}/>                    
                    </ListItemButton>                
             ))}            
        </Drawer>)
    }
    
    header = () => {
        return (            
            <Box sx={{ flexGrow: 1 }} style={{height: "10vh"}}>                
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            onClick={() => {this.setState({menuOpen: true})}}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>                    
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            FitMe
                        </Typography>


                        {AuthService.isAuthenticated && this.pages.map((page) => (                         
                                <Button                                    
                                    component={Link}
                                    to={page.link}
                                    key={page.title}                                
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.title}
                                </Button>                          
                        ))}
                    
                        {AuthService.isAuthenticated ?
                            <span>
                                <Button color="inherit" component={Link} to="/profile">Профиль</Button>
                                <Button color="inherit" onClick={this.logout} >Выход</Button>
                            </span>
                        :
                            <span>
                                <Button color="inherit" component={Link} to="/login">Авторизация</Button>
                                <Button color="inherit" component={Link} to="/register">Регистрация</Button>                            
                            </span>
                        }
                    
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }

    footer = () => {
        return (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>                
                <BottomNavigation showLabels>                             
                        <BottomNavigationAction label="Контакты" icon={<FavoriteIcon />} component={Link} to="/contacts" />                    
                </BottomNavigation>
          </Paper>
        )
    }

    render() {
        return (
            <div>
                {this.sidebar()}
                {this.header()}
                <div style={{height: "80vh"}}>
                    {this.props.children}
                </div>
                {this.footer()}
            </div>
        )
    }
}