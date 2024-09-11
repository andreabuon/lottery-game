import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
      <Container className="mt-5 d-flex flex-column align-items-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <h1 className="display-3">404</h1>
            <p className="lead">Nothing to see here... This is not the route you are looking for!</p>
            <Button as={Link} to="/" variant="primary" size="lg" className="mt-3">
              Go to Homepage
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }