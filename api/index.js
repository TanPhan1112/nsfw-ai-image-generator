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
                steps: 50,
                cfg_scale: 8,
                sampler_name: "DPM++ SDE Karras",
                seed: -1,
                width: 512,
                height: 512,

                // Hires. fix settings
                enable_hr: true,
                hr_scale: 2, // Upscale factor (2x = 2048x2048)
                hr_upscaler: "Latent", // Options: Latent, ESRGAN_4x, R-ESRGAN 4x+, etc.
                hr_second_pass_steps: 20, // Optional: number of steps for the second pass
                denoising_strength: 0.7 // Controls how much detail is regenerated
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