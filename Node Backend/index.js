const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8123;
app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());

app.post('/query', (req, res) => {
    const userInput = req.body.input;

    if (!userInput) {
        return res.status(400).send('Input parameter is missing');
    }
    const scriptPath = path.join('home', 'ezaan', 'Desktop', 'InsightWizard', 'InsightWizard Python Script', 'script.py');
    
    // Using python instead of python3 on Windows
    const pythonProcess = spawn('python', [scriptPath, userInput]);

    let responseData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(`Error: ${errorData}`);
            return res.status(500).send(`Error occurred: ${errorData}`);
        }
        res.json({ answer: responseData.trim() });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
