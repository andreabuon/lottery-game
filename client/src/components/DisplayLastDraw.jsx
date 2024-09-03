import { useState, useEffect } from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import API from '../API.mjs';
import { Draw } from '../../../common/Draw.mjs';
import './DisplayLastDraw.css';

export default function DisplayLastDraw(props) {
  const [draw, setDraw] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const showMessage = props.showMessage;
  const refreshUser = props.refreshUser;

  const retrieveDraw = async () => {
    setRefreshing(true);
    console.log('Retrieving the last draw...');
    try {
      let new_draw = await API.getLastDraw();
      console.log('Got the following new draw: ', new_draw.numbers);
      if(new_draw != draw){
        //If the page has just been loaded (draw == undefined) do not display the draw update message
        if(draw && new_draw.round != draw.round){
          showMessage(`New draw ${new_draw.round}!`, 'secondary');
        }
        setDraw(new_draw);
      }
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