import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
//React Components
import NavHeader from "./components/NavHeader";
import Homepage from './components/Homepage';
import Scoreboard from './components/Scoreboard';
import NotFound from './components/NotFound';
import { LoginForm } from './components/AuthComponents';

import API from './API.mjs';
import GameRules from './components/GameRules';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      showMessage(`Welcome, ${user.username}!`, 'success');
      setUser(user);
    } catch (err) {
      console.error(err);
      showMessage(err.toString(), 'danger');
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser('');
  };

  const showMessage = (message, type) => {
    setMessage({ msg: message, type: type });
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />

          <Container fluid className='mt-3'>
            {message &&
              <Alert variant={message.type} onClose={() => setMessage('')} className='ms-3 me-3' dismissible>{message.msg}</Alert>
              }
            <Outlet />
          </Container>
        </>
      }>
        <Route index element={
          <Homepage loggedIn={loggedIn} user={user} showMessage={showMessage} />
        } />

        <Route path="/scoreboard" element={
          loggedIn ? <Scoreboard showMessage={showMessage}/> : <Navigate replace to='/' />
        } />

        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />

        <Route path='/rules' element={
          loggedIn ? <GameRules/> : <Navigate replace to='/' />
        } />

        <Route path="*" element={
          <NotFound />
        } />

      </Route>
    </Routes>
  )
}

export default App
