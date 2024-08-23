import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
import { Container } from 'react-bootstrap';
import { Routes, Route, Outlet } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
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
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
  };


  return (
    <Routes>
      <Route element={<>
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          <Outlet/>
        </Container>
        </>
      }>
        <Route index element={
          <h1>Hello world! This is the index</h1>
        } />
        <Route path="/scoreboard" element={ <h1>Scoreboard</h1> } />
        <Route path="*" element={ /*<NotFound/>*/ <h1>Not found</h1> } />

        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>
  )
}

export default App
