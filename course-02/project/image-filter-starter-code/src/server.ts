require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  const validUrl = require('valid-url');
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?imageUrl={{}}")
  });

  // Filter Image Endpoint
  app.get("/filteredimage", async (req, res) => {
    if (!req.headers || !req.headers['api-key'])
      return res.status(401).send({ message: 'No authorization headers.' });

    const apiKey = req.headers['api-key'];
    if (apiKey !== process.env.API_KEY)
      return res.status(401).send({ message: 'Not authorized.' });

    const imageUrl = req.query.imageUrl;

    // check if image URL entered by user
    if (!imageUrl)
      return res.status(400).send({ success: false, message: 'Image URL is required' });

    // check if valid URL
    if (!validUrl.isUri(imageUrl))
      return res.status(400).send({ success: false, message: 'Image URL is not valid' });

    filterImageFromURL(imageUrl)
      .then(filteredPath => {
        return res.sendFile(filteredPath, () => {
          deleteLocalFiles([filteredPath]);
        });
      })
      .catch(() => {
        return res.status(422).send({ success: false, message: 'Error occurred'});
      });
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();