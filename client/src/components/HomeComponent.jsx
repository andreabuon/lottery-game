import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { getLastDraw } from '../API.mjs'

export default function Home(props) {
    return (
        props.loggedIn ? LoggedInHome(props) : LoggedOutHome()
    );
}

function DisplayLastDraw(props) {
    const [draw, setDraw] = useState(["Loading", "draw"]);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        const retrieveDraw = async () => {
            console.log("Retrieving last draw...");
            const draw = await getLastDraw();
            console.log("Got the following draw: ", draw);
            setDraw(draw);
        };
        retrieveDraw();
    }, [refreshing]);

    return (
        <>
            <h2>The last draw of the game was:

                <Table bordered >
                    <tbody>
                        <tr>
                            {
                                draw.map((num, index) => (
                                    <td key={index}>{num}</td>
                                ))
                            }
                        </tr>
                    </tbody>
                </Table>
            </h2>
            <Button onClick={() => setRefreshing(!refreshing)}>Refresh</Button>
        </>
    );
}

function LoggedInHome(props) {
    return (
        <>
            <h1>Hello {props.user.username}!</h1>
            <DisplayLastDraw />
        </>
    );
}

function LoggedOutHome() {
    return (<h1>Hello! Please login first 🤓</h1>);
}