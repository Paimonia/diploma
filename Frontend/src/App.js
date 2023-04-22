import './App.css';

import Excercises from './views/exercises'
import Home from './views/home'
import Login from './views/login'
import Register from './views/register'
import Plans from './views/plans'
import Stats from './views/stats'
import Targets from './views/targets'
import Trainings from './views/trainings'
import Contacts from './views/contacts'
import Profile from './views/profile'

import Container from './shared/container'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Container><Home /></Container>}/>
        <Route path="/login" element={<Container><Login /></Container>}/>
        <Route path="/register" element={<Container><Register /></Container>}/>
        <Route path="/exercises" element={<Container><Excercises /></Container>}/>
        <Route path="/plans" element={<Container><Plans /></Container>}/>
        <Route path="/stats" element={<Container><Stats /></Container>}/>
        <Route path="/targets" element={<Container><Targets /></Container>}/>
        <Route path="/trainings" element={<Container><Trainings /></Container>}/>
        <Route path="/contacts" element={<Container><Contacts /></Container>}/>
        <Route path="/profile" element={<Container><Profile /></Container>}/>
      </Routes>
    </Router>
  );
}

export default App;
