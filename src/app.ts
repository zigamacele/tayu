import { getGachaGames } from './helpers/supabase'
import { getMonthlyStatistics } from './logic/pupppet'

const getSomething = async () => {
  const data = await getGachaGames()

  if (data) {
    for (const game of data) {
      await getMonthlyStatistics(game.name, game.id)
    }
  }
}

getSomething()
