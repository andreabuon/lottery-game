import { Card, Container } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
//Components
import BettingForm from './BettingForm';
import DisplayLastDraw from './DisplayLastDraw';
import GameRules from './GameRules';


export default function Homepage(props) {
    return (
        props.loggedIn ? <Homepage_LoggedIn showMessage={props.showMessage} user={props.user} refresh={props.refresh} setRefresh={props.setRefresh}/> : <Homepage_LoggedOut/>
    );
}

function Homepage_LoggedIn(props) {
    return (
        <>
            <h1>Hello {props.user.username}! Your score is {props.user.score} 💵</h1>
            <DisplayLastDraw showMessage={props.showMessage} refresh={props.refresh} setRefresh={props.setRefresh} />
            <BettingForm user={props.user} showMessage={props.showMessage} refresh={props.refresh} setRefresh={props.setRefresh} />
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