const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// app.post('/generate', (req, res) => {
//     const prompt = req.body.prompt;
//     // Use a reliable placeholder image
//     const imageUrl = `https://dummyimage.com/512x512/000/fff&text=${encodeURIComponent(prompt)}`;
//     res.json({ imageUrl });
// });
app.post('/generate', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log('Received prompt:', prompt);

        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                steps: 20,
                width: 512,
                height: 512
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Stable Diffusion API error:', errorText);
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        const imageBase64 = data.images[0];
        res.json({ imageUrl: `data:image/png;base64,${imageBase64}` });
    } catch (error) {
        console.error('Backend error:', error.message);
        res.status(500).json({ error: 'Image generation failed' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});