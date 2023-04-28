import './App.css';

import React from 'react';
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
import EditorExercise from './views/editorexercise'
import EditorTraining from './views/editortraining'

import Container from './shared/container'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <React.StrictMode>
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
          <Route path="/exercise/edit/:id?" element={<Container><EditorExercise /></Container>} />
          <Route path="/training/edit/:id?" element={<Container><EditorTraining /></Container>} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
