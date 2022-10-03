const { Router } = require("express");
const Result = require("../models/Result");
const Student = require("../models/Student");

const router = Router();

// Student
//GET: Student home page route
router.get("/", (req, res) => {
  res.status(200).render("index", {
    message: null,
  });
});

//POST: Student auth login
router.post("/login", async (req, res, next) => {
  try {
    const { matnumber } = req.body;

    if (!matnumber)
      return res.status(401).render("index", {
        message: "Credentials is required!",
      });

    // check if the matric number exit in the DB
    const checkMat = await Student.findOne({ matnumber });
    if (checkMat) {
      req.session.name = checkMat;

      res.status(301).redirect(`/student/auth/${checkMat._id}`);
    } else {
      return res.status(401).render("index", {
        message: "Invalid mat number!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET: student/auth/:id
router.get("/student/auth/:id", async (req, res, next) => {
  try {
    if (req.session.name) {
      const st = await Student.findById(req.params.id);
      const student = await Result.findOne({
        student_id: req.params.id,
      }).populate("student_id");

      return res.status(200).render("student", {
        student,
        st,
      });
    } else {
      return res.status(301).redirect("/");
    }
  } catch (error) {
    next(error);
  }
});

// Admin
//GET: Admin home page route
router.get("/admin/login", (req, res) => {
  res.status(200).render("admin", {
    message: null,
  });
});

//POST: Admin auth login
router.post("/admin", async (req, res, next) => {
  try {
    const { id, password } = req.body;

    if (!id || !password)
      return res.status(401).render("admin", {
        message: "All credentials are required!",
      });

    if (id === "1" && password === "1")
      return res.status(401).redirect("/admin/dashboard");
    else
      return res.status(401).render("admin", {
        message: "Invalid credentials",
      });
  } catch (error) {
    next(error);
  }
});

//GET: admin dashboard
router.get("/admin/dashboard", (req, res) => {
  res.status(200).render("admin-dashboard");
});

//GET: Student registrations
router.get("/student/reg", (req, res) => {
  res.status(200).render("student-reg", {
    message: null,
  });
});

//POST: Student registrations
router.post("/register", async (req, res, next) => {
  try {
    // validate
    const { fname, lname, matnumber, dept, courses } = req.body;

    if (!fname || !lname || !matnumber || !dept || !courses) {
      return res.status(200).render("student-reg", {
        message: "Credentials are required!",
      });
    }

    // first check if the mat number already exits
    const checkIfExit = await Student.findOne({ matnumber });
    if (checkIfExit) {
      return res.status(200).render("student-reg", {
        message: `${checkIfExit.fname} ${checkIfExit.lname} already exits with matric number of ${checkIfExit.matnumber}`,
      });
    }

    // save to database

    await Student.create(req.body)
      .then(() => {
        return res.status(200).render("student-reg", {
          message: "Accout created",
        });
      })
      .catch((error) => {
        return res.status(400).render("student-reg", {
          message: "An error occured please try again later..",
        });
      });
  } catch (error) {
    next(error);
  }
});

// add result
router.get("/add/result", async (req, res, next) => {
  try {
    // get all students from db
    const students = await Student.find();
    return res.status(200).render("add-result", {
      students,
      form: null,
      message: null,
    });
  } catch (error) {
    next(error);
  }
});

//GET: Search/Selected student search
router.get("/search", async (req, res, next) => {
  try {
    // get all students from db
    const students = await Student.find();
    // get Search/selected student
    const student = await Student.findOne({ _id: req.query.student });

    if (!req.query.student) {
      return res.status(200).render("add-result", {
        students,
        form: student,
        message: null,
      });
    }

    return res.status(200).render("add-result", {
      students,
      form: student,
      message: null,
    });
  } catch (error) {
    next(error);
  }
});

// GET: all students
router.get("/students/all", async (req, res, next) => {
  try {
    const students = await Student.find();
    return res.status(200).render("all-student", {
      students,
    });
  } catch (error) {
    next(error);
  }
});

// GET: about us routes
router.get("/admin/about", (req, res) => {
  res.status(200).render("about");
});

// GET: delete student account
router.get("/delete/:id", async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(301).redirect("/students/all");
      })
      .catch((error) => {
        res.status(400).send("An error occured please try again leter");
      });
  } catch (error) {
    next(error);
  }
});

// POST: add result
router.post("/add", async (req, res, next) => {
  try {
    const { course_grade, course_code, matnumber } = req.body;
    const students = await Student.find();

    // check if mat number exit
    const checkMat = await Student.findOne({ matnumber });
    if (checkMat) {
      // now find the ID
      const findID = (await Student.findOne({ matnumber }))._id;

      // check brefore saving
      const c = await Result.findOne({ student_id: findID });
      if (!c) {
        // save the result now
        await Result.create({
          student_id: findID,
          course_grade,
          course_code,
        })
          .then(() => {
            return res.status(200).render("add-result", {
              students,
              form: null,
              message: `${checkMat.fname} ${checkMat.lname} Result has been uploaded successfully`,
            });
          })
          .catch((error) => {
            return res
              .status(400)
              .send("An error occured please try again leter..");
          });
      } else {
        return res.status(301).redirect("/add/result");
      }
    } else {
      return res.status(400).send("An error occured!");
    }
  } catch (error) {
    next(error);
  }
});

// page not found
//GET: add result
router.get("*", (req, res) => {
  res.status(200).send("Page not found");
});

module.exports = router;
