import logo from './logo.svg';
import './App.css';
import Navigation from './components/navigation';
import Workers from './components/wrokers';
import axios from 'axios';
import { useEffect } from 'react';
import {Route, Routes, Router} from 'react-router-dom'
import Login from './components/login';
import { Toaster } from 'react-hot-toast';
import Payments from './components/payments';


function App() {

  return (
    <>
    <Navigation></Navigation>
    <Routes>
      <Route path='/' element={<Login></Login>}/>
      <Route path='/workers' element={<Workers></Workers>}/>
      <Route path='/payments' element={<Payments></Payments>}/>
    </Routes>
    <Toaster></Toaster>
    </>
)
}

export default App
