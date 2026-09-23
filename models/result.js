const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    internal: {
      type: Number,
      required: true,
      min: 0,
      max: 40
    },
    external: {
      type: Number,
      required: true,
      min: 0,
      max: 60
    }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    subjects: {
      type: [subjectSchema],
      required: true,
      validate: {
        validator: function (subjects) {
          return subjects.length > 0;
        },
        message: "At least one subject is required"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Result", resultSchema);