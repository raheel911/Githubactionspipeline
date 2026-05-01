const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'mysql123',
    database: 'school'
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.log('Database not ready, retrying in 5 seconds...');
            setTimeout(handleDisconnect, 5000); 
        } else {
            console.log('CONNECTED to MySQL database!');
            
            // Create the table automatically
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL
                );
            `;
            db.query(createTableQuery, (err) => {
                if (err) console.error("Table creation failed:", err);
                else console.log("Table 'users' is verified/ready.");
            });
        }
    });

    db.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            console.error('Database Error:', err);
        }
    });
}

handleDisconnect();

// --- API ROUTES ---
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/add-user', (req, res) => {
    const name = req.body.name;
    if (!db) return res.status(500).send("Database connection not established yet.");
    
    db.query('INSERT INTO users (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send('User added to Database!');
    });
});

// --- START SERVER ---
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});