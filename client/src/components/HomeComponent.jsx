export default function Home(props) {
    return(
        props.loggedIn ? <h1>Hello! This is the index</h1> : <h1>Hello! Please login first</h1>
    );
}