import supabase from '../config/supabaseClient'
import { getCurrentTable } from '../utils/timeDate'

export const getGachaGames = async () => {
  const { data, error } = await supabase.from('games').select('*')

  if (error) console.log(error)

  return data
}

// FIX TYPE
export const inputMonthlyStatistics = async (data: any) => {
  const { error } = await supabase.from(getCurrentTable()).insert([...data])

  if (error) console.log(error)
}
