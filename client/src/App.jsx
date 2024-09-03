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
  const [messages, setMessages] = useState([]);
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
    setMessages([]);
    setUser('');
  };

  const refreshUser = async () => {
    console.log("Refreshing the user info.");
    try{
      let user = await API.getUserData();
      console.log(user);
      setUser(user);
    }catch (error){
      console.error(error);
    }
  }

  const showMessage = (text, type) => {
    let new_message = { msg: text, type: type };
    setMessages([...messages, new_message]);
  };

  const removeMessage = (message) => {
    let index = messages.indexOf(message);
    setMessages(messages.toSpliced(index, 1));
  };

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />

          <Container fluid className='mt-3'>
            {
            messages.map( (message, index) => (
              <Alert key={index} variant={message.type}  className='ms-3 me-3' onClose={() =>removeMessage(message)} dismissible>{message.msg}</Alert>)
            )
            }
            <Outlet />
          </Container>
        </>
      }>
        <Route index element={
          <Homepage loggedIn={loggedIn} user={user} showMessage={showMessage} refreshUser={refreshUser}/>
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
