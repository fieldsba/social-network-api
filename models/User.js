const { Schema, model} = require('mongoose');

const UserSchema = new Schema({
      username: {
        type: String,
        unique: "Sorry! That name is taken.",
        required: "You must enter your name.",
        trim: true
      },
      email: {
        type: String,
        unique: "This email is already in use",
        required: "You must enter a valid email address.",
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
      },
      thoughts: [ 
        {
          type: Schema.Types.ObjectId,
          ref: "Thought"
        }
      ],
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
});  // UserSchema

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});
  
const User = model('User', UserSchema);

module.exports = User;