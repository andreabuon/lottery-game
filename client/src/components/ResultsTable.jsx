import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap/';
//import APIs
import API from '../API.mjs'

export default function ResultsTable(props) {
    const [refreshing, setRefreshing] = useState(false);
    const [results, setResults] = useState([]);

    const showMessage = props.showMessage;

    const updateResults = async () => {
        console.log("Updating the results table!");
        setRefreshing(true);
        try {
            //let r = props.bets.map(async (bet) => ({bet: bet, result: await API.getResult(bet)}) );
            let r = await Promise.all(
                props.bets.map(async (bet) => ({ bet: bet, result: await API.getResult(bet) }))
            );
            setResults(r);
        } catch (err) {
            console.error(err);
            showMessage(err.toString(), 'danger'); //FIXME
        }
        setRefreshing(false);
        console.log("Results updated.");
    };

    useEffect(() => {
        updateResults();
    }, [props.bets.length]);

    return (
        <>
            <Row className='align-items-start'>
                <Col className="text-end">
                    <Button onClick={updateResults} disabled={refreshing}>Refresh results</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Table striped bordered className="text-center">
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Numbers</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length>0 &&
                                results.map((el, index) => (
                                <tr key={index}>
                                    <td>{el.bet.round}</td>
                                    <td>{el.bet.numbers.join(', ')}</td>
                                    <td>{el.result}</td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}