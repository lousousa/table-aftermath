require('dotenv').config()

const cli = require('next/dist/cli/next-start')
cli.nextStart(['-p', process.env.SERVER_PORT || 3000])