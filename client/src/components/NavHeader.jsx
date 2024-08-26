import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';

function NavHeader (props) {
  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>Lottery Game</Link>
        {
          props.loggedIn ? 
          <Link to='/scoreboard' className="btn btn-outline-light">Scoreboard</Link> :
          <Container/>
        }
        
        {
        props.loggedIn ? 
          <LogoutButton logout={props.handleLogout} /> :
          <Link to='/login' className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;
