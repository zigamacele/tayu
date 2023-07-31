import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  website: { URL: getConfig('WEBSITE_URL') },
  database: {
    HOST: getConfig('DB_HOST'),
    SECRET: getConfig('DB_SECRET'),
    GAMES_TABLE: getConfig('DB_GAMES_TABLE'),
  },
}

function getConfig(envKey: string): string {
  const envValue = process.env[envKey]
  if (envValue === undefined) {
    console.error(`Config key ${envKey} is undefined.`)
    throw new Error('Bad config.')
  }

  return envValue
}

export default config
