import config from '../config/envVariables'
import supabase from '../config/supabaseClient'
import { Gacha } from '../types/global'
import { getCurrentTable } from '../utils/timeDate'

export const getGachaGames = async () => {
  const { data, error } = await supabase
    .from(config.database.GAMES_TABLE)
    .select('*')
    .neq('eos', true)
    .order('id', { ascending: true })

  if (error) console.log(error)

  return data
}

//TODO lol.. who named this function
export const inputMonthlyStatistics = async (data: Gacha[]) => {
  const { error } = await supabase
    .from(getCurrentTable())
    .upsert(data, { onConflict: 'id' })

  if (error) console.log(error)
}

export const checkMonthlyTablePerms = async () => {
  const testData = {
    id: 1,
    totalRevenue: 1,
    androidRevenue: 1,
    iosRevenue: 1,
    totalDownloads: 1,
    androidDownloads: 1,
    iosDownloads: 1,
  }

  const { error } = await supabase
    .from(getCurrentTable())
    .upsert(testData, { onConflict: 'id' })

  console.log('CURRENT TABLE ERROR:', error)
}
