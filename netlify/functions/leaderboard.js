import pg from 'pg';

const { Pool } = pg;

// Secure connection pool configured with process.env.DATABASE_URL
let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('DATABASE_URL environment variable is not defined.');
      return null;
    }
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

// Auto-initialize leaderboard table schema if it does not exist
async function ensureTableExists(client) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      operative_name VARCHAR(255) UNIQUE NOT NULL,
      companion_name VARCHAR(255),
      standard_grade VARCHAR(255),
      level INT DEFAULT 1,
      total_hours FLOAT DEFAULT 0,
      syllabus_completion INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(createTableQuery);
}

export async function handler(event) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const dbPool = getPool();
  if (!dbPool) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: 'Database connection uninitialized',
        message: 'DATABASE_URL environment variable missing'
      })
    };
  }

  let client;
  try {
    client = await dbPool.connect();
    await ensureTableExists(client);

    // GET Request: Fetch all operatives sorted by level DESC, total_hours DESC
    if (event.httpMethod === 'GET') {
      const selectQuery = `
        SELECT
          id,
          operative_name AS "userName",
          companion_name AS "companionName",
          standard_grade AS "courseTitle",
          level,
          total_hours AS "totalStudyHours",
          syllabus_completion AS "syllabusPercent",
          updated_at
        FROM leaderboard
        ORDER BY level DESC, total_hours DESC;
      `;
      const result = await client.query(selectQuery);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ operatives: result.rows })
      };
    }

    // POST Request: UPSERT Operative Profile
    if (event.httpMethod === 'POST') {
      let bodyData = {};
      try {
        bodyData = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON payload' })
        };
      }

      const {
        userName,
        companionName,
        courseTitle,
        level,
        totalStudyHours,
        syllabusPercent
      } = bodyData;

      if (!userName || !userName.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'operative_name (userName) is required' })
        };
      }

      const upsertQuery = `
        INSERT INTO leaderboard (
          operative_name,
          companion_name,
          standard_grade,
          level,
          total_hours,
          syllabus_completion,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (operative_name)
        DO UPDATE SET
          companion_name = EXCLUDED.companion_name,
          standard_grade = EXCLUDED.standard_grade,
          level = EXCLUDED.level,
          total_hours = EXCLUDED.total_hours,
          syllabus_completion = EXCLUDED.syllabus_completion,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const values = [
        userName.trim(),
        companionName || 'COGNITIVE AI',
        courseTitle || 'Class 10th / 11th',
        level || 1,
        totalStudyHours || 0,
        syllabusPercent || 0
      ];

      const upsertResult = await client.query(upsertQuery, values);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Operative UPSERT successful',
          operative: upsertResult.rows[0]
        })
      };
    }

    return {
      statusCode: 450,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };

  } catch (error) {
    console.error('Leaderboard Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  } finally {
    if (client) client.release();
  }
}
