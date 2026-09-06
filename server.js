const express = require("express");
const jobs = require("./data/jobs");

const app = express();

const PORT = 3000;


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(express.json());


// ==================================================
// HOME ROUTE
// ==================================================

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the DevHire API",
        status: "API is running"
    });
});


// ==================================================
// GET ALL JOBS
// ==================================================

app.get("/api/jobs", (req, res) => {
    res.json(jobs);
});


// ==================================================
// GET A SINGLE JOB
// ==================================================

app.get("/api/jobs/:id", (req, res) => {

    const id = Number(req.params.id);

    const job = jobs.find((job) => job.id === id);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    res.json(job);
});


// ==================================================
// CREATE A NEW JOB
// ==================================================

app.post("/api/jobs", (req, res) => {

    const {
        title,
        company,
        location,
        salary,
        type,
        skills
    } = req.body;


    // Check required fields

    if (!title || !company || !location) {
        return res.status(400).json({
            message: "Title, company and location are required"
        });
    }


    // Generate a new ID

    const newId =
        jobs.length > 0
            ? Math.max(...jobs.map((job) => job.id)) + 1
            : 1;


    // Create the new job

    const newJob = {
        id: newId,
        title,
        company,
        location,
        salary: salary || "Not specified",
        type: type || "Full-time",
        skills: skills || []
    };


    // Add job to array

    jobs.push(newJob);


    // Send response

    res.status(201).json({
        message: "Job created successfully",
        job: newJob
    });
});


// ==================================================
// 404 ROUTE
// ==================================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// ==================================================
// ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Something went wrong on the server"
    });
});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
    console.log(
        `DevHire API is running on http://localhost:${PORT}`
    );
});