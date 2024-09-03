import { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import API from '../API.mjs'
import { Bet } from '../../../common/Bet.mjs';

export default function BettingForm(props) {
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [number3, setNumber3] = useState(0);
    const [waiting, setWaiting] = useState(false);

    const showMessage = props.showMessage;
    const refreshUser = props.refreshUser;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setWaiting(true);
        
        try {
            console.log('Creating bet!');
            let bet = new Bet(null, [number1, number2, number3]); //The null bet.user_id will be filled in by the server!
            console.log(bet.numbers);
            let bet_round = await API.createBet(bet);
            console.log(`Bet created for the round #${bet_round}.`);
            showMessage(`Bet created for the round #${bet_round}.`, 'success');
            await refreshUser();
        } catch (err) {
            console.error('Error while betting: ' + err);
            showMessage('Error while betting: ' + err, 'danger');
        }
        finally{
            setWaiting(false);
        }
    };

    return (
        <Container className="mt-4 d-flex justify-content-evenly">
            <Form onSubmit={handleSubmit}>
                <h3 className="mt-4 text-center">Make a bet for the next round now!</h3>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="number1">
                            <Form.Label>Number 1</Form.Label>
                            <Form.Control
                                type="number"
                                value={number1}
                                onChange={(e) => setNumber1(Number(e.target.value))}
                                placeholder="Enter first number"
                                min={0}
                                max={90}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="number2">
                            <Form.Label>Number 2</Form.Label>
                            <Form.Control
                                type="number"
                                value={number2}
                                onChange={(e) => setNumber2(Number(e.target.value))}
                                placeholder="Enter second number"
                                min={0}
                                max={90}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="number3">
                            <Form.Label>Number 3</Form.Label>
                            <Form.Control
                                type="number"
                                value={number3}
                                onChange={(e) => setNumber3(Number(e.target.value))}
                                placeholder="Enter third number"
                                min={0}
                                max={90}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Form.Label className='text-center'>Select a 0 to not bet on that number.</Form.Label>
                    <Form.Label className='text-center'>You must bet on at least 1 number.</Form.Label>
                    <Button variant="primary" type="submit" className="w-100" disabled={waiting}>
                        {waiting ? <Spinner animation="border" size="sm" /> : 'Bet now!'}
                    </Button>
                </Row>
            </Form>
        </Container>
    );
};