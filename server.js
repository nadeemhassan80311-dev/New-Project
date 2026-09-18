const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

const supabaseUrl = process.env.SUPABASEURL;
const supabaseKey = process.env.SUPABASEKEY;

const supabase = createClient(supabaseUrl, supabaseKey);


// ===============================
// READ - Get all teachers
// ===============================

app.get("/api/teachers", async (req, res) => {

    const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});


// ===============================
// CREATE - Add teacher
// ===============================

app.post("/api/teachers", async (req, res) => {

    const { name, age, salary, education } = req.body;

    const { data, error } = await supabase
        .from("teachers")
        .insert([
            {
                name: name,
                age: age,
                salary: salary,
                education: education
            }
        ])
        .select();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Teacher added successfully",
        data: data
    });
});


// ===============================
// UPDATE - Update teacher
// ===============================

app.put("/api/teachers/:id", async (req, res) => {

    const id = req.params.id;

    const { name, age, salary, education } = req.body;

    const { data, error } = await supabase
        .from("teachers")
        .update({
            name: name,
            age: age,
            salary: salary,
            education: education
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Teacher updated successfully",
        data: data
    });
});


// ===============================
// DELETE - Delete teacher
// ===============================

app.delete("/api/teachers/:id", async (req, res) => {

    const id = req.params.id;

    const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Teacher deleted successfully"
    });
});


// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5500;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;