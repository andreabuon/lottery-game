import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
//React Components
import NavHeader from "./components/NavHeader";
import Home from './components/HomeComponent';
import Scoreboard from './components/ScoreboardComponent';
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';

import './App.css'
import API from './API.mjs';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser('');
  };


  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />

          <Container fluid className='mt-3'>
            {message &&
              <Row>
                <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
              </Row>}
            <Outlet />
          </Container>
        </>
      }>
        <Route index element={
          <Home loggedIn={loggedIn} user={user} />
        } />

        <Route path="/scoreboard" element={
          loggedIn ? <Scoreboard /> : <Navigate replace to='/' />
        } />

        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />

        <Route path="*" element={
          <NotFound />
        } />

      </Route>
    </Routes>
  )
}

export default App
