import { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
//import APIs
import API from '../API.mjs'

export default function Results(props) {
    const [refreshing, setRefreshing] = useState(false);

    const showMessage = props.showMessage;

    const updateResults = async () => {
        console.log("Downloading the latest results!");
        setRefreshing(true);
        try {
            let results = await API.getNewResults();
            results.forEach(element => {
                //FIXME
                showMessage(`Round ${element.round_num}: you gained ${element.score} pts.`, 'info');
            });
            console.log("Results updated.");
        } catch (err) {
            console.error(err);
            showMessage(err.toString(), 'danger'); //FIXME
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        updateResults();
    }, [props.refresh]);

    return (
        <Container className="mt-4 d-flex justify-content-evenly">
            <Button variant="primary" type="submit" className="w-100" disabled={refreshing}>
                {refreshing ? <Spinner animation="border" size="sm" /> : 'Check results!'}
            </Button>
        </Container>
    );
}
