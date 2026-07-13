// yamdhud.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// अपना पेयर राउटर इम्पोर्ट करें
const pairRouter = require('./routes/pair');

// रूट को /pair पर माउंट करें (या आप / पर भी रख सकते हैं)
app.use('/pair', pairRouter);

// एक सिंपल होम पेज (वैकल्पिक)
app.get('/', (req, res) => {
    res.send('✅ Pairing server is running. Use /pair?number=91xxxxxxxxxx');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
