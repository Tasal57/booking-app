const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const PORT = 4000;


const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'booking_app',
    password: 'Hellothere38@',
    port: 5432,


})



app.get('/ping', (req, res) => {
    res.json({message: 'the server is working'})
});


app.post('/users', async (req, res) => {
    const { name, email} = req.body;


    if (!name || !email) {
        return res.status(400).json({error: "email and name are required"})
    };

    try {
        const result = await pool.query(
            'INSERT into users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.json({ message: 'user created',
            User: result.rows[0]
        });

    }catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' })

    }

});


app.get('/users', async (req, res) => {
    

    try {
        const result = await pool.query(
            'SELECT * FROM users'

        )
        
        res.json({message: 'user fetched', users: result.rows});
    
    }catch(err) {
        console.error(err);
        res.status(500).json({error: 'Database error'})
    }



});

app.get('/users/:id', async (req, res) => {
    console.log(`GET /users/:id hit on port ${PORT}, id=${req.params.id}`);
    const { id } = req.params;


    try {
        const result = await pool.query(
            'SELECT * from USERS WHERE id = $1',
            [id]

        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'id doesnt exist'})
        }

        res.json({message: result.rows[0]});
    
    }catch(err) {
        console.error(err);
        res.status(500).json({error: 'database error'})
    }


});













app.listen(PORT, () => {
    console.log(`Server is ruuning on http://localhost:${PORT}`);
});

