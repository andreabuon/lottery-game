import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner, Table } from 'react-bootstrap';
//import APIs
import API from '../API.mjs';

export default function Scoreboard(props) {
    const [scores, setScores] = useState([{ username: 'Loading', score: 0 }]);
    const [waiting, setWaiting] = useState(false);

    const showMessage = props.showMessage;

    const updateScores = async () => {
        setWaiting(true);
        try {
            const scores = await API.getBestScores();
            setScores(scores);
            console.log("Scores updated!");
            showMessage('Scores updated', 'secondary');
        } catch (error) {
            showMessage('Error fetching best scores: ' + error.toString(), 'danger');
        } finally {
            setWaiting(false);
        }
    };

    useEffect(() => {
        updateScores();
    }, []);

    return (
        <>
            <Row className='mb-2'>
                <Col>
                    <h1 className="text-primary">Scoreboard</h1>
                    <h3 className="text-muted">Best 3 Players</h3>
                </Col>
                <Col className="text-end">
                    <Button 
                        variant="outline-primary" 
                        onClick={() => updateScores()} 
                        disabled={waiting}>
                        {waiting ? <Spinner animation="border" size="sm"/> : 'Refresh Scores'}
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs={12} md={8} >
                    <Table striped bordered hover responsive className="text-center">
                        <thead>
                            <tr>
                                <th>Score</th>
                                <th>Username</th>
                            </tr>
                        </thead>

                        <tbody>
                            {scores.map((el, index) => (
                                <tr key={index}>
                                    <td>{el.score}</td>
                                    <td>{el.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}