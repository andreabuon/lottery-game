import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import API from '../API.mjs';
import { Draw } from '../../../common/Draw.mjs';
import './DisplayLastDraw.css';

export default function DisplayLastDraw(props) {
  const [draw, setDraw] = useState(new Draw([-1, -2, -3, -4, -5]));
  const [refreshing, setRefreshing] = useState(false);

  const showMessage = props.showMessage;
  const refreshUser = props.refreshUser;

  const retrieveDraw = async () => {
    setRefreshing(true);
    console.log('Retrieving the last draw...');
    try {
      let draw = await API.getLastDraw();
      console.log('Got the following draw: ', [...draw.numbers]);
      setDraw(draw);
      showMessage('Draw updated', 'secondary');
      await refreshUser();
    } catch (err) {
      showMessage(err, 'danger');
      console.error(err);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    retrieveDraw();
  }, []);

  return (
    <div className="display-last-draw p-4">
      <h2 className="mb-4 text-center">The Last Draw of the Game</h2>
      <Table bordered responsive="sm" className="text-center mb-4 draw-table">
        <tbody>
          <tr>
            {draw && Array.from(draw.numbers).map((num, index) => (
              <td key={index} className="p-3 draw-number">
                {num}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={() => retrieveDraw()}
          disabled={refreshing}
          className="refresh-button"
        >
          {refreshing ? <Spinner animation="border" size="sm" /> : 'Refresh Draw'}
        </Button>
      </div>
    </div>
  );
}