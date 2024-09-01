import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import API from '../API.mjs';
import { Draw } from '../../../common/Draw.mjs';

function DisplayLastDraw(props) {
  const [draw, setDraw] = useState(new Draw([-1,-2,-3,-4,-5]));
  const [refreshing, setRefreshing] = useState(false);

  const showMessage = props.showMessage;

  const retrieveDraw = async () => {
    setRefreshing(true);
    console.log('Retrieving the last draw...');
    try{
      let draw = await API.getLastDraw();
      console.log('Got the following draw: ', draw);
      setDraw(draw);
      showMessage('Draw updated', 'secondary');
    }catch(err){
      showMessage(err, 'danger');
      console.error(err);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    retrieveDraw();
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">The last draw of the game was:</h2>
      <Table bordered responsive="sm" className="text-center mb-4">
        <tbody>
          <tr>
            {draw && Array.from(draw.numbers).map((num, index) => ( //FIXME
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
          onClick={() => retrieveDraw()}
          disabled={refreshing}
        >
          Refresh draw
        </Button>
      </div>
    </div>
  );
}

export default DisplayLastDraw;