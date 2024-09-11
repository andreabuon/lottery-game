import { Badge, Container } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BettingForm from './BettingForm';
import DisplayLastDraw from './DisplayLastDraw';
import GameRules from './GameRules';


export default function Homepage(props) {
    return (
        props.loggedIn ? <Homepage_LoggedIn showMessage={props.showMessage} user={props.user} refresh={props.refresh} setRefresh={props.setRefresh} /> : <Homepage_LoggedOut />
    );
}

function Homepage_LoggedIn(props) {
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

function Homepage_LoggedOut() {
    return (
        <>
            <Container className="text-center">
                <h1 className="display-4 fw-bold">
                    Welcome!
                    <br />
                    <span className="text-secondary">
                        Please
                        <Link to='/login' className='btn btn-primary btn-lg mx-2 ms-2 me-2 align-middle'>
                            <FaSignInAlt className='me-2' />
                            Login
                        </Link>
                        to play 🤓
                    </span>
                </h1>
            </Container>
            <div className="mt-4">
                    <GameRules />
            </div>
        </>

    );
}