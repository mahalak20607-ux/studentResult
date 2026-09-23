const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

function calculateResult(subjects) {
  let total = 0;
  let passed = true;

  const processedSubjects = subjects.map((subject) => {
    const internal = Number(subject.internal);
    const external = Number(subject.external);
    const subjectTotal = internal + external;

    if (internal < 16 || external < 24 || subjectTotal < 40) {
      passed = false;
    }

    let grade = "F";

    if (subjectTotal >= 90) grade = "A+";
    else if (subjectTotal >= 80) grade = "A";
    else if (subjectTotal >= 70) grade = "B+";
    else if (subjectTotal >= 60) grade = "B";
    else if (subjectTotal >= 50) grade = "C";
    else if (subjectTotal >= 40) grade = "D";

    total += subjectTotal;

    return {
      name: subject.name.trim(),
      internal,
      external,
      total: subjectTotal,
      grade
    };
  });

  const maximum = subjects.length * 100;
  const percentage = maximum
    ? Number(((total / maximum) * 100).toFixed(2))
    : 0;

  let overallGrade = "F";

  if (!passed) {
    overallGrade = "F";
  } else if (percentage >= 90) {
    overallGrade = "A+";
  } else if (percentage >= 80) {
    overallGrade = "A";
  } else if (percentage >= 70) {
    overallGrade = "B+";
  } else if (percentage >= 60) {
    overallGrade = "B";
  } else if (percentage >= 50) {
    overallGrade = "C";
  } else {
    overallGrade = "D";
  }

  return {
    subjects: processedSubjects,
    total,
    maximum,
    percentage,
    grade: overallGrade,
    status: passed ? "PASS" : "FAIL"
  };
}

/* GET all results */
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });

    const formatted = results.map((result) => ({
      ...result.toObject(),
      ...calculateResult(result.subjects)
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch results"
    });
  }
});

/* GET single result */
router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId.toUpperCase();

    const result = await Result.findOne({ studentId });

    if (!result) {
      return res.status(404).json({
        message: "Student result not found"
      });
    }

    res.json({
      ...result.toObject(),
      ...calculateResult(result.subjects)
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch result"
    });
  }
});

/* CREATE result */
router.post("/", async (req, res) => {
  try {
    const {
      studentId,
      name,
      department,
      year,
      semester,
      subjects
    } = req.body;

    if (
      !studentId ||
      !name ||
      !department ||
      !year ||
      !semester ||
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const existingStudent = await Result.findOne({
      studentId: studentId.toUpperCase()
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "Student ID already exists"
      });
    }

    const result = await Result.create({
      studentId,
      name,
      department,
      year,
      semester,
      subjects
    });

    res.status(201).json({
      message: "Result added successfully",
      result: {
        ...result.toObject(),
        ...calculateResult(result.subjects)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to add result"
    });
  }
});

/* UPDATE result */
router.put("/:id", async (req, res) => {
  try {
    const {
      studentId,
      name,
      department,
      year,
      semester,
      subjects
    } = req.body;

    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found"
      });
    }

    const duplicate = await Result.findOne({
      studentId: studentId.toUpperCase(),
      _id: { $ne: req.params.id }
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Student ID already exists"
      });
    }

    result.studentId = studentId;
    result.name = name;
    result.department = department;
    result.year = year;
    result.semester = semester;
    result.subjects = subjects;

    await result.save();

    res.json({
      message: "Result updated successfully",
      result: {
        ...result.toObject(),
        ...calculateResult(result.subjects)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update result"
    });
  }
});

/* DELETE result */
router.delete("/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found"
      });
    }

    res.json({
      message: "Result deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete result"
    });
  }
});

module.exports = router;