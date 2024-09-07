import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
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

const REFRESH_INTERVAL = 20 * 1000; //seconds

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      showMessage(`Welcome, ${user.username}!`, 'primary');
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
    console.log("Updating the user data.");
    try{
      let user = await API.getUserData();
      setUser(user);
    }catch (error){
      console.error(error);
    }
  };

  const updateResults = async () => {
    console.log("Downloading the latest results!");
    try {
        let results = await API.getNewResults();
        results.forEach(element => { showMessage(`Round ${element.round_num}: you gained ${element.score} pts.`, 'info'); });
        console.log("Results updated.");
    } catch (err) {
        console.error(err);
    }
  };
  
  //Refresh the last, the user data and check for new results automatically
  useEffect(() => {
    if(loggedIn){
      refreshUser();
      updateResults();
    }
  }, [refresh]);
  setTimeout(() => setRefresh(!refresh), REFRESH_INTERVAL);

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
          <Homepage loggedIn={loggedIn} user={user} showMessage={showMessage} refresh={refresh} setRefresh={setRefresh}/>
        } />

        <Route path="/scoreboard" element={
          loggedIn ? <Scoreboard showMessage={showMessage} /> : <Navigate replace to='/' />
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
