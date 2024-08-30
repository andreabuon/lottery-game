import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import API from '../API.mjs'

const BetForm = (props) => {
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [number3, setNumber3] = useState(0);

    const setMessage = props.setMessage;

    const handleSubmit = async (event) => {
        event.preventDefault();
        let bet = new Set([number1, number2, number3]);
        if (bet.has(0)) {
            bet.delete(0);
        }
        if(bet.size == 0){
            console.error('You must bet on at least 1 number');
            setMessage({msg: 'You must bet on at least 1 number', type: 'danger'});
            return;
        }
        try{
            await API.createBet([...bet]);
            setMessage({msg: 'Bet created!', type: 'success'});
        }catch(err){
            console.error(err);
            setMessage({msg: 'Error: '+ err, type: 'danger'});
        }
    };

    return (
        <Container className="mt-4 d-flex justify-content-evenly">
            <Form onSubmit={handleSubmit}>
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
                    <Button variant="primary" type="submit" className="w-100">
                        Bet!
                    </Button>
                </Row>
            </Form>
        </Container>
    );
};


export default BetForm;