const { User } = require('../models');
const { Thought } = require('../models');

const UserController = {
      getAllUsers(req, res) {
          User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                res.sendStatus(400);
            });
      },

      getUserById({ params }, res) {
        User.findOne({ _id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                  res.status(404).json({ message: 'No user found with this id!' });
                  return;
                };
                res.json(dbUserData);
              })
            .catch(err => res.json(err));
      },
      
      createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      },

      updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
          .select('-__v')
          .then(dbUsersData => {
            if (!dbUsersData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUsersData);
          })
          .catch(err => res.status(400).json(err));
      },
       
      deleteUser({ params }, res) {
        User.findOne({ _id: params.id}) 
        .then (dbUserData => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user found with this id!' });
            };

            if (!dbUserData.thoughts) {
              return
            };
            
            for (i=0; i < dbUserData.thoughts.length; i++) {
                Thought.findOneAndDelete({ _id: dbUserData.thoughts[i] })
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        return res.status(404).json({ message: 'No thought found with this id!' });
                    };
                  })
                .catch(err => res.json(err));
            };

          User.findOneAndDelete({ _id: params.id })
            .then (dbUserData=> {
                return res.json({ message: 'User and associated thoughts, if any, deleted.'});
            })
            .catch(err => res.json(err))
        })
        .catch(err => res.json(err));    
      },

      addFriend({ params }, res) {
          User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId}},
            { new: true }
          )
          .select('-__v')
          .then(dbUsersData => {
            if (!dbUsersData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUsersData);
          })
          .catch(err => res.json(err));
      },

      deleteFriend({ params }, res) {
          User.findOneAndUpdate(
            { _id: params.userId},
            { $pull: { friends: params.friendId}},
            { new: true }
          )
          .select('-__v')
          .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this id!' });
            };
            res.json(dbUserData);
      })
      .catch(err => res.json(err));
    }
};

module.exports = UserController;