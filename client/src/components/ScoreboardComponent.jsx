import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
//import APIs

//TODO load top 3 users from db
function aggiornaLista() {
    console.log("Click!");
};

export default function Scoreboard() {
    const [scoreboardList, setScoreboard] = useState([{ username: 'user1', score: 1 }, { username: 'user2', score: 2 }, { username: 'user3', score: 3 }]);
    useEffect(() => aggiornaLista(), [scoreboardList]);

    return (
        <>
            <h1>Scoreboard</h1>
            <Button onClick={aggiornaLista}>Refresh</Button>

            <Table striped>
                <thead>
                    <tr>
                        <th>Score</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {scoreboardList.map((el) => (
                        <tr>
                            <td>{el.score}</td>
                            <td>{el.username}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}