import { DEFAULT_TIMEOUT } from '../constants/inquirer'
import {
  checkTablePerms,
  getGachaGames,
  inputMonthlyStatistics,
} from '../helpers/supabase'
import { Answers } from '../types/inquirer'
import { Gacha, GameSchema } from '../types/supabase'
import { getSessionConfig } from './inquirer'
import { getMonthlyStatistics } from './pupppet'

export const startGatheringInformation = async () => {
  const data = await getGachaGames()
  const { mode, partial, timeout, table, perms, defaultTimeout, currentTable } =
    (await getSessionConfig()) as unknown as Answers

  let dataArray: GameSchema[] = []

  if (mode === 'full') {
    dataArray = [...(data as GameSchema[])]
  } else {
    const partialArray: number[] = JSON.parse(partial) as unknown as number[]
    if (partialArray) {
      for (const el of partialArray) {
        const game = data?.find((game) => game.id === el)
        if (game) {
          dataArray.push(game)
        }
      }
    }
  }

  if (perms) {
    await checkTablePerms(currentTable, table)
  }

  const gatheredInformation: Gacha[] = []
  if (dataArray) {
    for (const [index, game] of dataArray.entries()) {
      setTimeout(
        async () => {
          const monthlyStats = await getMonthlyStatistics(
            game.name,
            game.id,
            game.same_name,
            game.same_slot,
          )
          gatheredInformation.push(monthlyStats)
          if (index + 1 === dataArray.length) {
            await inputMonthlyStatistics(gatheredInformation)
            console.log('FINISHED GATHERING INFORMATION')
          }
        },
        (defaultTimeout ? DEFAULT_TIMEOUT : timeout) * 60 * 1000 * index,
      )
    }
  } else {
    console.log('SOMETHING WENT WRONG WITH THE DATABASE')
  }
}
