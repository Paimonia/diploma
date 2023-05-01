import React from 'react'
import AuthService from '../services/auth.js';
import HomeUser from './homeuser.js';
import HomeAnon from './homeanon.js';

export default class Home extends React.Component {
    render() {
        return (
            <div>
                {AuthService.isAuthenticated && <HomeUser /> }
                {!AuthService.isAuthenticated && <HomeAnon /> }
            </div>
        )
    }
}