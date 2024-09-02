import { Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import { FaTrophy, FaSignInAlt } from 'react-icons/fa';
import { IoBook } from "react-icons/io5";

export default function NavHeader(props) {
  return (
    <Navbar bg='primary' variant='dark' expand='lg' className='shadow-sm'>
      <Container fluid>
        <NavLink to='/' className='navbar-brand fs-4 fw-bold text-white'>
          Lottery Game
        </NavLink>
        <Navbar.Toggle aria-controls='navbar-nav' />
        <Navbar.Collapse id='navbar-nav' className='justify-content-end'>
          <Nav className='align-items-center'>
            {props.loggedIn && (
              <><NavLink
                to='/rules'
                className='btn btn-outline-light mx-2 d-flex align-items-center'
              >
                <IoBook className='me-2' />
                Rules
              </NavLink>
              <NavLink
                to='/scoreboard'
                className='btn btn-outline-light mx-2 d-flex align-items-center'
              >
                  <FaTrophy className='me-2' />
                  Scoreboard
                </NavLink></>
            )}

            {props.loggedIn ? (

              <LogoutButton
                logout={props.handleLogout}
                className='btn btn-outline-light mx-2'
              />
            ) : (
              <NavLink
                to='/login'
                className='btn btn-outline-light mx-2 d-flex align-items-center'
              >
                <FaSignInAlt className='me-2' />
                Login
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
