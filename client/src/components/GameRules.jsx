import { Card, Container, Table } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function GameRules(props) {
  return (
    <>
      {!props.loggedIn &&
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
      }

      <Container className="mt-4 d-flex justify-content-center">
        <Card className="shadow-lg">
          <Card.Body>
            <Card.Title className="text-center mb-4">
              <strong>Lottery Game: Number Drawing Betting Game</strong>
            </Card.Title>
            <p>
              <strong>Overview:</strong> This game involves a periodic drawing of 5 distinct numbers. Players can bet on specific
              numbers in hopes of matching those drawn by the server.
            </p>
            <p>
              <strong>Game Mechanics:</strong>
            </p>
            <ul>
              <li>
                <strong>Drawings:</strong> Every 2 minutes, the server randomly generates a set of 5 numbers in the range of 1
                to 90.
              </li>
              <li>
                <strong>Betting:</strong> Before each drawing, players can place a single bet on 1, 2, or 3 distinct numbers.
              </li>
              <li>
                <strong>Cost of Bets:</strong>
                <ul>
                  <li>1 number: 5 points</li>
                  <li>2 numbers: 10 points</li>
                  <li>3 numbers: 15 points</li>
                </ul>
              </li>
              <li>
                Players can only place a bet if they have enough points. Each player starts with 100 points. When a player runs
                out of points, they cannot place any more bets.
              </li>
            </ul>
            <p>
              <strong>Results and Winnings:</strong> After each drawing, the game checks the player's bet against the drawn
              numbers, with the following possible outcomes:
            </p>
            <ul>
              <li>
                <strong>All numbers correct:</strong> The player wins twice the points spent on the bet.
              </li>
              <li>
                <strong>No numbers correct:</strong> The player wins 0 points.
              </li>
              <li>
                <strong>Some numbers correct:</strong> The player wins a proportional amount based on the formula:
                <br />
                <code>Gain = 2 × (points spent) × (correct numbers / played numbers)</code>
              </li>
            </ul>
            <p>
              <strong>Gain Table:</strong>
            </p>

            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Numbers in the Bet</th>
                  <th>Correct Numbers</th>
                  <th>Points Gained</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>10 points</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>1</td>
                  <td>10 points</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>2</td>
                  <td>20 points</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>1</td>
                  <td>10 points</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>2</td>
                  <td>20 points</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>3</td>
                  <td>30 points</td>
                </tr>
                <tr>
                  <td>1, 2, or 3</td>
                  <td>0</td>
                  <td>0 points</td>
                </tr>
              </tbody>
            </Table>

          </Card.Body>
        </Card>
      </Container>
    </>

  );
}
