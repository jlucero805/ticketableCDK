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

    if (httpMethod == 'GET') {
        const rows = await pool.query(`
        `);
        return {
            body: JSON.stringify({ rows: rows.rows }, null, 2),
            statusCode: 200,
        };
    };

    if (httpMethod == 'POST') {
        const body = JSON.parse(event.body);
        if (!validateBody(body, [])) {
            return { statusCode: 400, };
        };
        try {
            await pool.query(`
                INSERT INTO
                    ()
                VALUES
                    ();
            `, []);
            return {
                body: JSON.stringify({ success: 'ok' }, null, 2),
                statusCode: 201,
            };
        } catch (e) {
            return { statusCode: 409, };
        };
    };

    if (httpMethod == 'PUT') {
        const body = JSON.parse(event.body);
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