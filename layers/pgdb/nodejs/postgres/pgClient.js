const createPool = Pool => {
    return new Pool({
        user: 'postgres',
        host: 'tdjwf7ow6y9r70.cnxwjvhwxhrt.us-west-1.rds.amazonaws.com',
        database: 'postgres',
        password: process.env.RDS_PASS,
        port: 5432,
    });
};

module.exports = {
    createPool,
};