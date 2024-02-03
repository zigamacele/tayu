import config from '../config/envVariables'
import supabase from '../config/supabaseClient'
import { Gacha, GameSchema } from '../types/supabase'

export const getGachaGames = async () => {
  const { data, error } = await supabase
    .from(config.database.GAMES_TABLE)
    .select('*')
    .neq('eos', true)
    .neq('region', 'CHINA')
    .order('id', { ascending: true })

  if (error) console.log(error)

  return data as GameSchema[] | undefined
}

export const upsertMonthlyTable = async (
  data: Gacha[],
  tableToUpsert: string,
) => {
  const { error } = await supabase
    .from(tableToUpsert)
    .upsert(data, { onConflict: 'id' })

  if (error) console.error('ERROR: ', error)
}

export const checkTablePerms = async (tableToUpsert: string) => {
  const testData = {
    id: 1, // Genshin Impact
    totalRevenue: 1,
    androidRevenue: 1,
    iosRevenue: 1,
    totalDownloads: 1,
    androidDownloads: 1,
    iosDownloads: 1,
  }

  const { error: errorUpsert } = await supabase
    .from(tableToUpsert)
    .upsert(testData, { onConflict: 'id' })

  const { error: errorDelete } = await supabase
    .from(tableToUpsert)
    .delete()
    .eq('id', testData.id)

  console.log('ERROR AT UPSERT: ', errorUpsert)
  console.log('ERROR AT DELETE: ', errorDelete)
}
