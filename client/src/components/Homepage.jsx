import { useEffect, useState } from 'react'
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
//Components
import DisplayLastDraw from './DisplayLastDraw'
import BettingForm from './BettingForm'
import GameRules from './GameRules'

const AUTO_REFRESH_INTERVAL = 20;

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