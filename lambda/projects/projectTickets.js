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
    const projectId = event.pathParameters.projectId;

    if (httpMethod == 'GET') {
        const rows = await pool.query(`
            SELECT
                t.*,
                p.name project_name
            FROM project p
            INNER JOIN ticket t
                ON p.id = t.project_id
            WHERE p.id = $1;
        `, [ projectId ]);
        return {
            body: JSON.stringify({ rows: rows.rows }, null, 2),
            statusCode: 200,
        };
    };

    if (httpMethod == 'POST') {
        const body = JSON.parse(event.body);
        if (!validateBody(body, ['title', 'priority', 'description'])) {
            return { statusCode: 400, };
        };
        try {
            await pool.query(`
                INSERT INTO ticket (
                    project_id,
                    name,
                    title,
                    priority,
                    description
                )
                VALUES (
                        -- project_id --
                        $1,
                        -- get name of project and concat ticket count --
                        (
                            CONCAT(
                                (
                                    SELECT
                                        name
                                    FROM project
                                    WHERE id = $1
                                    LIMIT 1
                                ),
                                '-',
                                (
                                    SELECT
                                        ticket_count
                                    FROM project
                                    WHERE id = $1
                                    LIMIT 1
                                )
                            )
                        ),
                        -- title --
                        $2,
                        -- priority --
                        $3,
                        -- description --
                        $4
                );
            `, [ projectId, body.title, body.priority, body.description, ]);
            await pool.query(`
                -- increment ticket_count on project --
                UPDATE project
                    SET
                        ticket_count = ticket_count + 1
                WHERE id = $1;
            `, [projectId]);
            return {
                body: JSON.stringify({ success: 'ok' }, null, 2),
                statusCode: 201,
            };
        } catch (e) {
            return {
                statusCode: 409,
                body: JSON.stringify(e, null, 2),
            };
        };
    };

    return {
        statusCode: 404,
    };

};