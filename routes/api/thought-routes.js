const router = require('express').Router();

const {
  getAllThoughts,
  createThought,
  getThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

router
  .route('/')
  .get(getAllThoughts);
  
  router
  .route('/:id')
  .post(createThought)
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

router
  .route('/:thoughtId/reactions')
  .post(createReaction);

router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;