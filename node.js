const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg'); // Për PostgreSQL

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Validimi
    if (!email || !password) {
        return res.status(400).send("Mungojnë të dhënat!");
    }

    // Hashimi i fjalëkalimit
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ruajtja në databazë
    const pool = new Pool({ /* konfigurimi i databazës */ });
    try {
        await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2)',
            [email, hashedPassword]
        );
        res.send("Regjistrimi u krye me sukses!");
    } catch (err) {
        res.status(500).send("Gabim në server!");
    }
});

app.listen(3000, () => console.log('Serveri u nis në portin 3000'));