import { DEFAULT_TIMEOUT } from '../constants/inquirer'
import {
  checkTablePerms,
  getGachaGames,
  upsertMonthlyTable,
} from '../helpers/supabase'
import { green, red } from '../styles/chalk'
import { Answers } from '../types/inquirer'
import { Gacha, GameSchema } from '../types/supabase'
import { getCurrentTable } from '../utils/timeDate'
import { getSessionConfig } from './inquirer'
import { getMonthlyStatistics } from './pupppet'

export const startGatheringInformation = async () => {
  const data = await getGachaGames()
  const { mode, partial, timeout, table, perms, defaultTimeout } =
    (await getSessionConfig()) as unknown as Answers

  const tableToUpsert = table ?? getCurrentTable()

  let dataArray: GameSchema[] = []

  if (mode === 'full') {
    dataArray = [...(data as GameSchema[])]
  } else {
    const partialArray = partial.split(',').map((el) => parseInt(el))
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
    await checkTablePerms(tableToUpsert)
  }

  const failedGames: number[] = []
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
          if (monthlyStats.status === 'error') {
            failedGames.push(monthlyStats.gameId)
          } else {
            gatheredInformation.push(monthlyStats.game as Gacha)
          }

          if (index + 1 === dataArray.length) {
            await upsertMonthlyTable(gatheredInformation, tableToUpsert)
            console.log(red('Failed Games: '), failedGames)
            console.log(green('Finished gathering information'))
          }
        },
        (defaultTimeout ? DEFAULT_TIMEOUT : timeout) * 60 * 1000 * index,
      )
    }
  } else {
    console.log(red('Something went wrong while fetching the data'))
  }
}
