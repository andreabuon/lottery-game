import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { getLastDraw } from '../API.mjs';

function DisplayLastDraw() {
  const [draw, setDraw] = useState(['Loading', 'draw']);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const retrieveDraw = async () => {
      console.log('Retrieving last draw...');
      let draw = JSON.parse(await getLastDraw());
      console.log('Got the following draw: ', draw);
      setDraw(draw);
    };
    retrieveDraw();
  }, [refreshing]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">The last draw of the game was:</h2>
      <Table bordered hover responsive="sm" className="text-center mb-4">
        <tbody>
          <tr>
            {draw.map((num, index) => (
              <td key={index} className="p-3">
                {num}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={() => setRefreshing(!refreshing)}
        >
          Refresh draw
        </Button>
      </div>
    </div>
  );
}

export default DisplayLastDraw;