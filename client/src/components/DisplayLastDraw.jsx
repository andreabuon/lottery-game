import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import API from '../API.mjs';
import { Draw } from '../../../common/Draw.mjs';
import './DisplayLastDraw.css';

export default function DisplayLastDraw(props) {
  const [draw, setDraw] = useState();
  const [waiting, setWaiting] = useState(false);

  const showMessage = props.showMessage;
  const setRefresh = props.setRefresh;

  const retrieveDraw = async () => {
    setWaiting(true);
    console.log('Retrieving the last draw...');
    try {
      let new_draw = await API.getLastDraw();
      if (new_draw) {
        console.log('Got the following new draw: ', new_draw.numbers);
        setDraw(new_draw);
      } else {
        showMessage('No draws yet! Please wait.', 'warning');
      }
    } catch (err) {
      showMessage(err.toString(), 'danger');
      console.error(err);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    retrieveDraw();
  }, [props.refresh]);

  return (
    <div className="display-last-draw p-4">
      <h2 className="mb-4 text-center">The last (#{draw && draw.round}) draw of the game was:</h2>
      <Table bordered responsive="sm" className="text-center mb-4 draw-table">
        <tbody>
          <tr>
            {draw && draw.numbers.map((num, index) => (
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
          onClick={() => { setRefresh(!props.refresh) }}
          disabled={waiting}
          className="refresh-button"
        >
          {waiting ? <Spinner animation="border" size="sm" /> : 'Refresh'}
        </Button>
      </div>
    </div>
  );
}