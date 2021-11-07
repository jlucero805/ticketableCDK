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
    const orgId = event.pathParameters.orgId;

    if (httpMethod == 'GET') {
        const rows = await pool.query(`
            SELECT *
            FROM account
            WHERE id = $1
            AND type = 'org';
        `, [ orgId ]);
        if (rows.rows.length > 0) {
            return {
                body: JSON.stringify({ rows: rows.rows }, null, 2),
                statusCode: 200,
            };
        } 
    };

    if (httpMethod == 'PUT') {
        const body = JSON.parse(event.body);
        try {
            const rows = await pool.query(`
                UPDATE account
                SET
                    description = $1,
                    name = $2
                WHERE id = $3
                AND type = 'org'
                RETURNING *;
            `, [body.description, body.name, orgId]);
            return {
                body: JSON.stringify({ rows: rows.rows }, null, 2),
                statusCode: 200,
            };
        } catch (e) {
            return { statusCode: 500, };
        };
    };

    if (httpMethod == 'DELETE') {
        return {
            statusCode: 204,
        };
    };

    return {
        statusCode: 404,
    };

};