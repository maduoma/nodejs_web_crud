require('dotenv').config(); // If you don't want to use .env file, Comment this line
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
app.use(bodyParser.json());


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// If you don't want to use .env file, Comment this code below
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
}; 

// If you don't want to use .env file, uncomment this code below
// const config = {
//     user: 'M.Achilefu', // your username
//     password: '123', // your password
//     server: '00287',
//     database: 'NODEJS-CRUD', // your database name
//     options: {
//         encrypt: true,
//         trustServerCertificate: true  // Change this to true to trust self-signed certificates
//     }
// };

sql.connect(config).catch(err => console.log(err));

app.get('/read', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM users`;
        res.json({ statusCode: 200, data: result.recordset });
    } catch (err) {
        res.json({ statusCode: 500, message: 'An error occurred' });
    }
});

// app.post('/create', async (req, res) => {
//     console.log("Incoming payload: ", req.body); 
//     // console.log(req.body);  // Debugging line
//     // console.log("Request Body:", req.body);
//     const { name, email } = req.body;
//     try {
//         const request = new sql.Request();
//         request.input('name', sql.NVarChar, name);
//         request.input('email', sql.NVarChar, email);
//         await request.query('INSERT INTO users (name, email) VALUES (@name, @email)');
//         res.json({statusCode: 200});
//     } catch (err) {
//         console.log("Error: ", err);  // Debug Line
//         res.json({statusCode: 500, message: 'An error occurred'});
//     }
// });

app.post('/create', async (req, res) => {
    const { name, email } = req.body;
    try {
        await sql.query`INSERT INTO users (name, email) VALUES (${name}, ${email})`;
        res.json({ statusCode: 200 });
    } catch (err) {
        res.json({ statusCode: 500, message: 'An error occurred' });
    }
});


// app.put('/update', async (req, res) => {
//     const { id, name, email } = req.body;
//     try {
//         const request = new sql.Request();
//         request.input('id', sql.Int, id);
//         request.input('name', sql.NVarChar, name);
//         request.input('email', sql.NVarChar, email);
//         await request.query('UPDATE users SET name = @name, email = @email WHERE id = @id');
//         res.json({statusCode: 200});
//     } catch (err) {
//         console.log(err);
//         res.json({statusCode: 500, message: 'An error occurred'});
//     }
// });

app.put('/update', async (req, res) => {
    const { id, name, email } = req.body;
    try {
        await sql.query`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id}`;
        res.json({ statusCode: 200 });
    } catch (err) {
        res.json({ statusCode: 500, message: 'An error occurred' });
    }
});


// app.delete('/delete', async (req, res) => {
//     const { id } = req.body;
//     try {
//         const request = new sql.Request();
//         request.input('id', sql.Int, id);
//         await request.query('DELETE FROM users WHERE id = @id');
//         res.json({statusCode: 200});
//     } catch (err) {
//         console.log(err);
//         res.json({statusCode: 500, message: 'An error occurred'});
//     }
// });


app.delete('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await sql.query`DELETE FROM users WHERE id = ${id}`;
        res.json({ statusCode: 200 });
    } catch (err) {
        res.json({ statusCode: 500, message: 'An error occurred' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000: http://localhost:3000');
});
