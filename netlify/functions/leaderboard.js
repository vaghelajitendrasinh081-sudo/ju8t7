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

// Auto-initialize and alter leaderboard table schema to include Google ID, Email & Avatar
async function ensureTableExists(client) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      avatar_url TEXT,
      operative_name VARCHAR(255) NOT NULL,
      companion_name VARCHAR(255),
      standard_grade VARCHAR(255),
      level INT DEFAULT 1,
      total_hours FLOAT DEFAULT 0,
      syllabus_completion INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(createTableQuery);

  // Alter table columns if table existed previously without google_id or email
  const alterQueries = [
    `ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;`,
    `ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;`,
    `ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS avatar_url TEXT;`
  ];

  for (const q of alterQueries) {
    try {
      await client.query(q);
    } catch (err) {
      // Ignore column already exists errors
    }
  }
}

export async function handler(event) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    // GET Request: Fetch all operatives OR specific user if google_id / email provided in query params
    if (event.httpMethod === 'GET') {
      const queryParams = event.queryStringParameters || {};
      const targetGoogleId = queryParams.google_id;
      const targetEmail = queryParams.email;

      if (targetGoogleId || targetEmail) {
        const userQuery = `
          SELECT
            id,
            google_id AS "googleId",
            email,
            avatar_url AS "avatarUrl",
            operative_name AS "userName",
            companion_name AS "companionName",
            standard_grade AS "courseTitle",
            level,
            total_hours AS "totalStudyHours",
            syllabus_completion AS "syllabusPercent",
            updated_at
          FROM leaderboard
          WHERE google_id = $1 OR email = $2
          LIMIT 1;
        `;
        const userResult = await client.query(userQuery, [targetGoogleId || '', targetEmail || '']);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ operative: userResult.rows[0] || null })
        };
      }

      const selectQuery = `
        SELECT
          id,
          google_id AS "googleId",
          email,
          avatar_url AS "avatarUrl",
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

    // POST Request: UPSERT Operative Profile targeting google_id or email or operative_name
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
        googleId,
        email,
        avatarUrl,
        userName,
        companionName,
        courseTitle,
        level,
        totalStudyHours,
        syllabusPercent
      } = bodyData;

      const opName = userName && userName.trim() ? userName.trim() : (email ? email.split('@')[0] : 'OPERATIVE');

      // UPSERT Query prioritizing google_id -> email -> operative_name
      let upsertQuery = '';
      let values = [];

      if (googleId) {
        upsertQuery = `
          INSERT INTO leaderboard (
            google_id,
            email,
            avatar_url,
            operative_name,
            companion_name,
            standard_grade,
            level,
            total_hours,
            syllabus_completion,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
          ON CONFLICT (google_id)
          DO UPDATE SET
            email = EXCLUDED.email,
            avatar_url = COALESCE(EXCLUDED.avatar_url, leaderboard.avatar_url),
            operative_name = EXCLUDED.operative_name,
            companion_name = EXCLUDED.companion_name,
            standard_grade = EXCLUDED.standard_grade,
            level = EXCLUDED.level,
            total_hours = EXCLUDED.total_hours,
            syllabus_completion = EXCLUDED.syllabus_completion,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;
        values = [
          googleId,
          email || null,
          avatarUrl || null,
          opName,
          companionName || 'COGNITIVE AI',
          courseTitle || 'Class 10th / 11th',
          level || 1,
          totalStudyHours || 0,
          syllabusPercent || 0
        ];
      } else if (email) {
        upsertQuery = `
          INSERT INTO leaderboard (
            email,
            google_id,
            avatar_url,
            operative_name,
            companion_name,
            standard_grade,
            level,
            total_hours,
            syllabus_completion,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
          ON CONFLICT (email)
          DO UPDATE SET
            google_id = COALESCE(EXCLUDED.google_id, leaderboard.google_id),
            avatar_url = COALESCE(EXCLUDED.avatar_url, leaderboard.avatar_url),
            operative_name = EXCLUDED.operative_name,
            companion_name = EXCLUDED.companion_name,
            standard_grade = EXCLUDED.standard_grade,
            level = EXCLUDED.level,
            total_hours = EXCLUDED.total_hours,
            syllabus_completion = EXCLUDED.syllabus_completion,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *;
        `;
        values = [
          email,
          googleId || null,
          avatarUrl || null,
          opName,
          companionName || 'COGNITIVE AI',
          courseTitle || 'Class 10th / 11th',
          level || 1,
          totalStudyHours || 0,
          syllabusPercent || 0
        ];
      } else {
        upsertQuery = `
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
        values = [
          opName,
          companionName || 'COGNITIVE AI',
          courseTitle || 'Class 10th / 11th',
          level || 1,
          totalStudyHours || 0,
          syllabusPercent || 0
        ];
      }

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
