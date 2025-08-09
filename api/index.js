const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', (req, res) => {
    const prompt = req.body.prompt;
    // Use a reliable placeholder image
    const imageUrl = `https://dummyimage.com/512x512/000/fff&text=${encodeURIComponent(prompt)}`;
    res.json({ imageUrl });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});