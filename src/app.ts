import { getGachaGames, inputMonthlyStatistics } from './helpers/supabase'
import { getMonthlyStatistics } from './logic/pupppet'
import { Gacha } from './types/global'

const startGatheringInformation = async () => {
  const data = await getGachaGames()
  const updateEveryXMinutes = 2

  const gatheredInformation: Gacha[] = []

  if (data) {
    for (const [index, game] of data.entries()) {
      setTimeout(
        async () => {
          const monthlyStats = await getMonthlyStatistics(game.name, game.id)
          gatheredInformation.push(monthlyStats)

          if (index + 1 === data.length)
            await inputMonthlyStatistics(gatheredInformation)
        },
        updateEveryXMinutes * 60 * 1000 * index,
      )
    }
  }
}

startGatheringInformation()
