require ("dotenv").config()
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const cors = require('cors')
const bearer = require('express-bearer-token')

// connect Database at MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Mongo"))

// Middleware
app.use(
    cors({
      exposedHeaders: ['access-token'],
    })
);
app.use(bearer());
app.use(express.json())


app.get("/",(req, res) => res.send('Hello BTPN!'));
const {
    usersRoutes,
    generateToken,
} = require('./src/routes');
app.use('/users', usersRoutes)
app.use('/create', generateToken)

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));