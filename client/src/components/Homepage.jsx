import { useState } from 'react'
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
//Components
import DisplayLastDraw from './DisplayLastDraw'
import BettingForm from './BettingForm'
import ResultsTable from './ResultsTable';
import GameRules from './GameRules'

const AUTO_REFRESH_INTERVAL = 20;

export default function Homepage(props) {
    return (
        props.loggedIn ? <Homepage_LoggedIn showMessage={props.showMessage} user={props.user} refreshUser={props.refreshUser}/> : <Homepage_LoggedOut/>
    );
}

function Homepage_LoggedIn(props) {
    const [refresh, setRefresh] = useState([]);
    const refreshData = () => {
        props.refreshUser();
        setRefresh([...refresh]); //FIXME //HACK
    }

    return (
        <>
            <h1>Hello {props.user.username}! Your score is {props.user.score}</h1>
            <DisplayLastDraw showMessage={props.showMessage} refresh={refresh} refreshData={refreshData} />
            <BettingForm showMessage={props.showMessage} refreshData={refreshData} />
            <ResultsTable showMessage={props.showMessage} refresh={refresh} refreshData={refreshData} />
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