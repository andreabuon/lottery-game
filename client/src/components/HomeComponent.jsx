import DisplayLastDraw from './DisplayLastDraw'
import BetForm from './BetForm'
import GameRules from './GameRules'

export default function Home(props) {
    return (
        props.loggedIn ? LoggedInHome(props) : LoggedOutHome()
    );
}

function LoggedInHome(props) {
    return (
        <>
            <h1>Hello {props.user.username}! Your score is {props.user.score}</h1>
            <DisplayLastDraw showMessage={props.showMessage}/>
            <BetForm showMessage={props.showMessage}/>
        </>
    );
}

function LoggedOutHome() {
    return (
        <>
            <h1>Hello! Please login to play 🤓</h1>
            <GameRules/>
        </>    
    );
}