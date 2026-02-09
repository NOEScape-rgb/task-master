const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    index: true
  },
  todoName: {
    type: String,
    required: true,
    trim: true
  },
  todoDescription: {
    type: String,
    trim: true,
    default: '' 
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;
  
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const due = new Date(value);
        due.setHours(0, 0, 0, 0);
  
        return due >= today;
      },
      message: "Due date cannot be in the past"
    }
  }
,

  isDone: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict : true,
  
   // This turns '_id' into a string 'id' when you send JSON to the frontend
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id; 
    }
  }
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;