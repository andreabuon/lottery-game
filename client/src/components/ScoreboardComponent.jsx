import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
//import APIs
import { getBestScores } from '../API.mjs'

export default function Scoreboard() {

    const [scores, setScores] = useState([{ username: 'Loading', score: 0 }]);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        const updateScores = async () => {
            //console.log("Refreshing...");
            //console.log(scores);
            const scores = await getBestScores();
            setScores(scores);
        };
        updateScores();
    }, [refreshing]);

    return (
        <>
            <h1>Scoreboard</h1>
            <Button onClick={() => setRefreshing(!refreshing)}>Refresh scores</Button>

            <Table striped>
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
        </>
    );
}