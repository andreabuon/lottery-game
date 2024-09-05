import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap/';
//import APIs
import API from '../API.mjs'

export default function Scoreboard(props) {
    const [scores, setScores] = useState([{ username: 'Loading', score: 0 }]);
    const [refreshing, setRefreshing] = useState(false);

    const showMessage = props.showMessage;

    const updateScores = async () => {
        setRefreshing(true);
        try {
            const scores = await API.getBestScores();
            setScores(scores);
            console.log("Scores updated!");
            showMessage('Scores updated', 'secondary');
        } catch (err) {
            console.error(err);
            showMessage(err.toString(), 'danger'); //FIXME
        }
        setRefreshing(false);
    };

    useEffect(() => {
        updateScores();
    }, []);

    return (
        <>
            <Row className='align-items-start'>
                <Col>
                    <h1>Scoreboard</h1>
                    <h2>Best 3 Players</h2>
                </Col>
                <Col className="text-end">
                    <Button onClick={() => updateScores()} disabled={refreshing}>Refresh scores</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Table striped bordered className="text-center">
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