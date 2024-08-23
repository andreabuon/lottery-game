export default function Home(props) {
    return(
        props.loggedIn ?  LoggedInHome(props) : LoggedOutHome()
    );
}

function LoggedInHome(props){
    return (<h1>Hello {props.user}! This is the index</h1>);
}

function LoggedOutHome(){
    return (<h1>Hello! Please login first</h1>);
}