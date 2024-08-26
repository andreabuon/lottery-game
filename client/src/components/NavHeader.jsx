import { Container, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';

function NavHeader (props) {
  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <NavLink to='/' className='navbar-brand'>Lottery Game</NavLink>
        {
          props.loggedIn ?
            <NavLink to='/scoreboard' className="btn btn-outline-light">Scoreboard</NavLink>
            :
            null
        }
        
        {
        props.loggedIn ? 
          <LogoutButton logout={props.handleLogout} /> :
          <NavLink to='/login' className='btn btn-outline-light'>Login</NavLink>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;
