import {
  checkMonthlyTablePerms,
  getGachaGames,
  inputMonthlyStatistics,
} from './helpers/supabase'
import { getMonthlyStatistics } from './logic/pupppet'
import { Gacha } from './types/global'
import { getCurrentTable } from './utils/timeDate'

const startGatheringInformation = async () => {
  const data = await getGachaGames()
  checkMonthlyTablePerms()
  const updateEveryXMinutes = 1

  const gatheredInformation: Gacha[] = []

  if (data) {
    console.log('TABLE:' + getCurrentTable())
    console.log('STARTING TO GATHER INFORMATION')
    for (const [index, game] of data.entries()) {
      setTimeout(
        async () => {
          const monthlyStats = await getMonthlyStatistics(game.name, game.id)
          gatheredInformation.push(monthlyStats)

          if (index + 1 === data.length) {
            await inputMonthlyStatistics(gatheredInformation)
            console.log('FINISHED GATHERING INFORMATION')
          }
        },
        updateEveryXMinutes * 60 * 1000 * index,
      )
    }
  } else {
    console.log('SOMETHING WENT WRONG WITH THE DATABASE')
  }
}

startGatheringInformation()
