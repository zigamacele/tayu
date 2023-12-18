import puppeteer from 'puppeteer'

import config from '../config/envVariables'
import { dim, green, red } from '../styles/chalk'
import { Gacha } from '../types/supabase'
import { formatStats, greenTextParenthesis } from '../utils/format'

export const getMonthlyStatistics = async (
  name: string,
  id: number,
  same_name: boolean,
  slot: number[] | null,
) => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  process.env && (await page.goto(config.website['URL']))

  await page.setViewport({
    width: 640,
    height: 480,
  })

  await page.type('.MuiInputBase-input', name)

  const currentGacha: Gacha = {
    id,
    totalRevenue: 0,
    androidRevenue: 0,
    iosRevenue: 0,
    totalDownloads: 0,
    androidDownloads: 0,
    iosDownloads: 0,
  }

  try {
    const searchResultSelector = '.SearchAppResult-module__root--P1frD'
    await page.waitForSelector(searchResultSelector)

    const elements = await page.$$(searchResultSelector)

    // TODO this needs to be reworked
    const diffRegionSameName = same_name ? 6 : 2
    for (let i = 0; i < diffRegionSameName; i++) {
      if (same_name && slot && !slot.includes(i)) continue

      const element = elements[i]

      const isRevenueForAndroid = await element?.$$eval(
        '[data-test="Android"]',
        (elements) => elements.length > 0,
      )

      const platform = isRevenueForAndroid ? 'android' : 'ios'

      const statistics =
        '.MuiTypography-root.MuiTypography-small.SearchAppResult-module__mediumEmphasis--W5uvW.css-11j76p1'

      await element?.waitForSelector(statistics)

      const stats = await element?.$$(statistics)

      if (stats) {
        for (const stat of stats) {
          const currentStat = await stat.evaluate((el) => el.textContent)
          const formattedStat = formatStats(currentStat)

          if (currentStat?.includes('$')) {
            currentGacha[`${platform}Revenue`] += formattedStat
            currentGacha['totalRevenue'] += formattedStat
          } else {
            currentGacha[`${platform}Downloads`] += formattedStat
            currentGacha['totalDownloads'] += formattedStat
          }
        }
      }
    }

    console.log(dim(currentGacha.id), green(name))

    return { status: 'success', gameId: id, game: currentGacha }
  } catch {
    console.log(red('Error:'), name, greenTextParenthesis(id))

    return { status: 'error', gameId: id }
  } finally {
    await browser.close()
  }
}
