const express = require("express");
const app = express();

app.use(express.json());

const studentSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  age: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
};

const students = [];

// 1.
app.post("/api/students", (req, res, next) => {
  try {
    const { name, email, age, course, department } = req.body;

    if (!name || !email || !age || !course || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStudent = {
      id: students.length + 1,
      name,
      email,
      age: Number(age),
      course,
      department,
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
});

// 2. dont know
app.get("/api/students", (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const totalStudents = students.length;
    const totalPages = Math.ceil(totalStudents / limit) || 1;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedStudents = students.slice(startIndex, endIndex);

    res.status(200).json({
      students: paginatedStudents,
      pagination: {
        currentPage: page,
        limit: limit,
        totalStudents: totalStudents,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    next(error)
  }
});

// 3.
app.get("/api/students/:id", (req, res, next) => {
    try {
        const parsedId=parseInt(req.params.id)

        if (isNaN(parsedId)) {
            return res.status(400).json({message: "Invalid ID"})
        }

        const student=students.find((u) => u.id === parsedId)

        if(!student) {
            return res.status(404).json({message: "Student not found"})
        }

        res.status(200).json(student)
    } catch (error) {
        next(error)
    }
})

// 4.
app.patch("/api/students/:id", (req, res, next) => {
    try {
        const parsedId=parseInt(req.params.id)

        if (isNaN(parsedId)) {
            return res.status(400).json({message: "Invalid ID"})
        }

        const student=students.find((u) => u.id === parsedId)

        if (!student) {
            return res.status(404).json({message: "Student not found"})
        }

        const {name, email, age, course, department}=req.body
        if (name) student.name=name;
        if (email) student.email=email;
        if (age) student.age=Number(age);
        if (course) student.course=course;
        if (department) student.department=department;

        res.status(200).json(student)
    } catch (error) {
        next(error)
    }
})

// 5.
app.delete("/api/students/:id", (req, res, next) => {
    try {
        const parsedId=parseInt(req.params.id)

        if (isNaN(parsedId)) {
            return res.status(400).json({message: "Invalid ID"})
        }

        const studentIndex=students.findIndex((u) => u.id === parsedId)

        if (studentIndex === -1) {
            return res.status(404).json({message: "Student not found"})
        }

        students.splice(studentIndex, 1);

        res.status(200).json({message: "Student deleted successfully"})
        
    } catch (error) {
        next(error)
    }
})

app.listen(3000, (req, res) => {
  console.log("server is running");
});
