const AWS = require('aws-sdk');
const { createPool } = require('/opt/nodejs/postgres/pgClient');
const { Pool } = require('pg');
const { validateBody } = require('/opt/nodejs/utils/utils');

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
            SELECT * FROM account
            WHERE id = $1
            AND type = 'member'
            LIMIT 1;
        `, [ memberId ]);
        if (rows.rows.length > 0) {
            return {
                body: JSON.stringify({ rows: rows.rows }, null, 2),
                statusCode: 200,
            }; 
        }
    };

    if (httpMethod == 'PUT') {
        const body = JSON.parse(event.body);
        if (!validateBody(body, ['description', 'name'])) {
            return { statusCode: 400, };
        };
        try {
            const rows = await pool.query(`
                UPDATE account
                SET
                    description = $1,
                    name = $2
                WHERE id = $3
                AND type = 'member'
                RETURNING *;
            `, [ body.description, body.name, memberId ]);
            return {
                body: JSON.stringify({ rows: rows.rows }, null, 2),
                statusCode: 200,
            };
        }
        catch (e) {
            return { statusCode: 500, };
        };
    };

    if (httpMethod == 'DELETE') {
        await pool.query(`
            DELETE FROM account
            WHERE id = $1
            AND type = 'member';
        `, [ memberId ]);
        return {
            statusCode: 204,
        };
    };

    return {
        statusCode: 404,
    };

};