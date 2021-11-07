const AWS = require('aws-sdk');
const { createPool } = require('/opt/nodejs/postgres/pgClient');
const { Pool } = require('pg');

const pool = createPool(Pool);

exports.handler = async event => {

    if (event.headers.authorization != '123') {
        return {
            statusCode: 401,
        };
    };

    const httpMethod = event.requestContext.http.method;
    const memberId = event.pathParameters.memberId;

    if (httpMethod == 'GET') {
        const rows = await pool.query(`
            SELECT
                p.*,
                a2.username owner_username
            FROM account a
            INNER JOIN project p
                ON a.id = p.owner_id
            INNER JOIN account a2
                ON a2.id = p.owner_id;
        `);
        return {
            body: JSON.stringify({ rows: rows.rows }, null, 2),
            statusCode: 200,
        };
    };

    if (httpMethod == 'POST') {
        const body = JSON.parse(event.body);
        try {
            await pool.query(`
                INSERT INTO project
                    (owner_id, name)
                VALUES
                    ($1, $2);
            `, [memberId, body.name]);
            return {
                body: JSON.stringify({ success: 'ok' }, null, 2),
                statusCode: 201,
            };
        } catch (e) {
            return { statusCode: 409, };
        };
    };

    return {
        statusCode: 404,
    };

};