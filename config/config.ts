require('dotenv').config({path: './config' + '/.env'})

module.exports = {
	environment: process.env.NODE_ENV || "development",
	port: parseInt(process.env.PORT)  || 7777,
	pg_host: process.env.PGHOST || "localhost",
	pg_port: process.env.PGPORT || 8888,
	pg_user: process.env.PGUSER || "null",
	pg_password: process.env.PGPASSWORD || "null",
	pg_database: process.env.PGDATABASE || "null",
}
