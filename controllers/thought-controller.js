const { Thought, User} = require('../models');
 
const ThoughtController = {
      getAllThoughts(req, res) {
          Thought.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                res.sendStatus(400);
            });
      },

      getThought({ params }, res) {
        Thought.findOne({ _id: params.id})
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this id!' });
                  return;
                };
                res.json(dbThoughtData);
              })
            .catch(err => res.json(err));
      },
      
      createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: params.id },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbThoughtData)
          })
          .catch(err => res.json(err));
      },

      updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
          .select('-__v')
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
      },

      deleteThought({ params }, res) {
          Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
              }
              res.json({ message: 'Thought deleted.'});
          })
          .catch(err => res.json(err));
      },

      createReaction({ params, body }, res) {
          Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
          )
            .then(dbThoughtData => {
              if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
              }
              res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
      },

      deleteReaction({ params }, res) {
          Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
          )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            };
            res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
      }
      
};

module.exports = ThoughtController;