import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

//React Components
import { LoginForm } from './components/AuthComponents';
import GameRules from './components/GameRules';
import Homepage from './components/Homepage';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFound';
import Scoreboard from './components/Scoreboard';

import API from './API.mjs';

const REFRESH_INTERVAL = 20 * 1000; //seconds

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [refresh, setRefresh] = useState(false);

  /* This function handles the login process.
  * It requires a username and a password inside a "credentials" object. */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      showMessage(`Welcome, ${user.username}!`, 'primary');
    } catch (error) {
      showMessage('Error logging in: ' + error.toString(), 'danger');
    }
  };

  /* This function handles the logout process. */
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessages([]);
    setUser('');
  };

  const refreshUser = async () => {
    console.log("Updating the user data.");
    try {
      let user = await API.getUserData();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user data: ' + error);
      showMessage('Error fetching user data: ' + error.toString(), 'danger');
    }
  };

  const updateResults = async () => {
    console.log("Downloading the latest results!");
    try {
      let results = await API.getNewResults();
      results.forEach(element => { showMessage(`Round ${element.round_num}: you gained ${element.score} pts.`, 'info'); });
      console.log("Results updated.");
    } catch (error) {
      showMessage('Error fetching user results: '+ error.toString(), 'danger');
    }
  };

  //Refresh the last draw, the user data and check for new results automatically
  useEffect(() => {
    if (loggedIn) {
      refreshUser();
      updateResults();
    }
  }, [refresh]);
  setTimeout(() => setRefresh(!refresh), REFRESH_INTERVAL);

  //Check and restore login session after app refresh
  useEffect(() => {
    const checkAuth = async () => {
      try{
        const user = await API.getUserData(); 
        setLoggedIn(true);
      setUser(user);
      } catch (error){ /* do nothing */ }
    };
    checkAuth();
  }, []);

  function Message(text, type){
    this.id = Date.now();
    this.msg = text;
    this.type = type;
  }

  const showMessage = (text, type) => {
    let new_message = new Message(text, type);
    setMessages([...messages, new_message]);
  };

  const removeMessage = (messageToRemove) => {
    setMessages(messages.filter((msg) => (msg.id !== messageToRemove.id)));
  };

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />

          <Container fluid className='mt-3'>
            {
              messages.map((message) => (
                <Alert
                  key={message.id} 
                  variant={message.type} 
                  className='ms-3 me-3' 
                  onClose={() => removeMessage(message)} 
                  dismissible>
                  {message.msg}
                </Alert>)
              )
            }
            <Outlet />
          </Container>
        </>
      }>
        <Route index element={
          loggedIn ? <Homepage loggedIn={loggedIn} user={user} showMessage={showMessage} refresh={refresh} setRefresh={setRefresh} /> : <GameRules loggedIn={loggedIn} />
        } />

        <Route path="/scoreboard" element={
          loggedIn ? <Scoreboard showMessage={showMessage} /> : <Navigate replace to='/' />
        } />

        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />

        <Route path='/rules' element={
          loggedIn ? <GameRules loggedIn={loggedIn} /> : <Navigate replace to='/' />
        } />

        <Route path="*" element={
          <NotFound />
        } />

      </Route>
    </Routes>
  )
}

export default App
