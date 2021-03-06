'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Painting from '../model/painting-model';

const jsonParser = bodyParser.json();
const paintingRouter = new Router();

paintingRouter.post('/api/paintings', jsonParser, (request, response, next) => {
  return new Painting(request.body).save()
    .then((painting) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(painting);
    })
    .catch(next);
});

paintingRouter.get('/api/paintings/:id', (request, response, next) => {
  return Painting.findById(request.params.id)
    .then((painting) => {
      if (!painting) {
        logger.log(logger.INFO, 'GET error, no paintings found with this id');
        return next(new HttpErrors(404, 'no paintings found'));
      }
      logger.log(logger.INFO, 'GET success, responding with 200');
      return response.json(painting);
    })
    .catch(next);
});

paintingRouter.put('/api/paintings/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Painting.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPainting) => {
      if (!updatedPainting) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpErrors(404, 'painting not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedPainting);
    })
    .catch(next);
});

paintingRouter.delete('/api/paintings/:id', (request, response, next) => {
  return Painting.findByIdAndRemove(request.params.id)
    .then((painting) => {
      if (!painting) {
        logger.log(logger.INFO, 'DELETE error - no painting found with this id');
        return next(new HttpErrors(404, 'painting not found'));
      }
      logger.log(logger.INFO, 'DELETE request processed - 204 status');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default paintingRouter;
