const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'booking_app',
  password: 'Hellothere38@',
  port: 5432,
});

// Test route
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is working 🚀' });
});

// Create user route (now saves to database)
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required"
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.json({
      message: 'User created',
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/users', async (req, res) => {
  
  try {
    const result = await pool.query('SELECT * FROM users');

    res.json({
      users: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});
// get a single user by ID
app.get('/users/:id', async (req, res) => {
  console.log(`GET /users/:id hit on port ${PORT}, id=${req.params.id}`);
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error'})

  }

  
  
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE * FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error : 'User not found'})
    }

    res.json({message :'user deleted'});

  
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error'})
  }
});


// update a user

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required'});

}

  try {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
    
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error : 'user not found'});
  }

  res.json({ message: 'User updated', user: result.rows[0] });


  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Database error"});
  }



});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});