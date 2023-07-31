import config from '../config/envVariables'
import supabase from '../config/supabaseClient'
import { Gacha } from '../types/global'
import { getCurrentTable } from '../utils/timeDate'

export const getGachaGames = async () => {
  const { data, error } = await supabase
    .from(config.database.GAMES_TABLE)
    .select('*')

  if (error) console.log(error)

  return data
}

export const inputMonthlyStatistics = async (data: Gacha[]) => {
  const { error } = await supabase
    .from(getCurrentTable())
    .upsert(data, { onConflict: 'id' })

  if (error) console.log(error)
}
