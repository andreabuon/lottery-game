import { Badge } from 'react-bootstrap';
import BettingForm from './BettingForm';
import DisplayLastDraw from './DisplayLastDraw';

export default function Homepage(props) {
    return (
        <>
            <h1 className="text-center my-4">
                Hello, {props.user.username}!
                <Badge bg="primary" pill className="ms-3">
                    Score: {props.user.score} 💵
                </Badge>
            </h1>

            <DisplayLastDraw
                showMessage={props.showMessage}
                refresh={props.refresh}
                setRefresh={props.setRefresh}
            />
            <BettingForm
                user={props.user}
                showMessage={props.showMessage}
                refresh={props.refresh}
                setRefresh={props.setRefresh}
            />
        </>
    );
}