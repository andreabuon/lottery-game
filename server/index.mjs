// imports
import express from 'express';

// init express
const app = new express();
const PORT = 3001;

/*** APIs ***/

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// Activating the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});