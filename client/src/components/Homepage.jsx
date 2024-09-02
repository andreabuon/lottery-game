import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import DisplayLastDraw from './DisplayLastDraw'
import BettingForm from './BettingForm'
import GameRules from './GameRules'

export default function Homepage(props) {
    return (
        props.loggedIn ? Homepage_LoggedIn(props) : Homepage_LoggedOut()
    );
}

function Homepage_LoggedIn(props) {
    return (
        <>
            <h1>Hello {props.user.username}! Your score is {props.user.score}</h1>
            <DisplayLastDraw showMessage={props.showMessage} />
            <BettingForm showMessage={props.showMessage} />
        </>
    );
}

function Homepage_LoggedOut() {
    return (
        <Container className="mt-2 d-flex justify-content-center">
            <Card className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Welcome! Please
                        <Link
                            to='/login'
                            className='btn btn-primary mx-2'>
                            <FaSignInAlt className='me-2' />
                            Login
                        </Link> to play 🤓
                    </Card.Title>

                    <GameRules />
                </Card.Body>
            </Card>
        </Container>
    );
}