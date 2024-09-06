import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdLogout } from "react-icons/md";

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username, password };

    props.login(credentials);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <Form.Group controlId='username' className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={ev => setUsername(ev.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Button type='submit' size='lg' className="w-100 mb-2">Login</Button>
            <Link className='btn btn-danger w-100' to={'/'}>Cancel</Link>
          </Form>
        </Col>
      </Row>
    </Container>
  )
};

function LogoutButton(props) {
  return (
    <Button variant='outline-light' onClick={props.logout}><MdLogout className='me-2' />Logout</Button>
  )
}

export { LoginForm, LogoutButton };