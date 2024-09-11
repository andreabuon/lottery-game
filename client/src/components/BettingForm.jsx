import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import API from '../API.mjs'
import { Bet, COST_PER_BET_NUMBER } from '../../../common/Bet.mjs';

export default function BettingForm(props) {
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [number3, setNumber3] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [betCost, setBetCost] = useState(0);

    const showMessage = props.showMessage;
    const setRefresh = props.setRefresh;

    useEffect(() => {
        let cost = 0;
        for(const num of new Set([number1, number2, number3])){
            if(num)
                cost += COST_PER_BET_NUMBER;
        }
        setBetCost(cost);
    }, [number1, number2, number3]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setWaiting(true);

        try {
            //This is just to validate the bet numbers.
            //The bet fields will be filled in by the server.
            let temp_bet = new Bet(null, null, [number1, number2, number3]);
            console.log('The player wants to bet on the following numbers: ', temp_bet.numbers);
            if(temp_bet.getCost() > props.user.score){
                throw Error('The player does not have enough points to place this bet.');
            }

            let bet = await API.createBet(temp_bet.numbers);
            console.log(`Bet created for the round #${bet.round}: ${bet.numbers}`);
            showMessage(`Bet created for the round #${bet.round}: ${bet.numbers}`, 'success');

            setRefresh(!props.refresh);
        } catch (error) {
            showMessage('Error placing bet: ' + error.toString(), 'danger');
        }
        finally {
            setWaiting(false);
        }
    };

    return (
        <>
            <Container className="mt-4 mb-4 d-flex justify-content-evenly">
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
                                    max={90} />
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
                                    max={90} />
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
                                    max={90} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Label className='text-center'>You must bet on at least 1 number. You can bet on up to 3 distinct numbers. </Form.Label>
                        <Form.Label className='text-center'>Select 0 to not bet on a number.</Form.Label>                        
                        <Button variant="primary" type="submit" className="w-100" size='lg' disabled={waiting}>
                            {waiting ? <Spinner animation="border" size="sm" /> : `Bet now! ${betCost} 💵`}
                        </Button>
                    </Row>
                </Form>
            </Container>
        </>
    );
}