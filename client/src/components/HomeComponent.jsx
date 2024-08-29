import { useEffect, useState } from 'react';
import BetForm from './BetForm'
import DisplayLastDraw from './DisplayLastDraw'

export default function Home(props) {
    return (
        props.loggedIn ? LoggedInHome(props) : LoggedOutHome()
    );
}



function LoggedInHome(props) {
    return (
        <>
            <h1>Hello {props.user.username}! Your score is {props.user.score}</h1>
            <DisplayLastDraw/>
            <BetForm/>
        </>
    );
}

function LoggedOutHome() {
    return (<h1>Hello! Please login first 🤓</h1>);
}