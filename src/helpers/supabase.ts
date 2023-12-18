import config from '../config/envVariables'
import supabase from '../config/supabaseClient'
import { Gacha, GameSchema } from '../types/supabase'
import { getCurrentTable } from '../utils/timeDate'

export const getGachaGames = async () => {
  const { data, error } = await supabase
    .from(config.database.GAMES_TABLE)
    .select('*')
    .neq('eos', true)
    .order('id', { ascending: true })

  if (error) console.log(error)

  return data as GameSchema[] | undefined
}

// TODO lol.. who named this function
export const inputMonthlyStatistics = async (data: Gacha[]) => {
  const { error } = await supabase
    .from(getCurrentTable())
    .upsert(data, { onConflict: 'id' })

  if (error) console.error('ERROR: ', error)
}

export const checkTablePerms = async (currentTable: boolean, table: string) => {
  const tableToTest = currentTable ? getCurrentTable() : table

  const testData = {
    id: 9999,
    totalRevenue: 1,
    androidRevenue: 1,
    iosRevenue: 1,
    totalDownloads: 1,
    androidDownloads: 1,
    iosDownloads: 1,
  }

  const { error: errorUpsert } = await supabase
    .from(tableToTest)
    .upsert(testData, { onConflict: 'id' })

  const { error: errorDelete } = await supabase
    .from(tableToTest)
    .delete()
    .eq('id', testData.id)

  console.log('ERROR AT UPSERT: ', errorUpsert)
  console.log('ERROR AT DELETE: ', errorDelete)
}
