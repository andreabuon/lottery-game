import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
//import APIs
import API from '../API.mjs'

export default function Scoreboard(props) {
    const [scores, setScores] = useState([{ username: 'Loading', score: 0 }]);
    const [refreshing, setRefreshing] = useState(false);
    
    const showMessage= props.showMessage;

    const updateScores = async () => {
        setRefreshing(true);
        try{
            const scores = await API.getBestScores();
            setScores(scores);
            console.log("Scores updated!");
        } catch (err){
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
            <h1>Scoreboard</h1>
            <Button onClick={() => updateScores()} disabled={refreshing}>Refresh scores</Button>

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