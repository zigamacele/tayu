import puppeteer from 'puppeteer'
import config from '../config/envVariables'
import { formatStats } from '../utils/statistics'
import { Gacha } from '../types/global'

export const getMonthlyStatistics = async (name: string, id: number) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  process.env && (await page.goto(config.website['URL']))

  await page.setViewport({
    width: 640,
    height: 480,
  })

  await page.type('.MuiInputBase-input', name)

  const searchResultSelector = '.SearchAppResult-module__root--P1frD'
  await page.waitForSelector(searchResultSelector)

  const elements = await page.$$(searchResultSelector)

  const currentGacha: Gacha = {
    id,
    totalRevenue: 0,
    androidRevenue: 0,
    iosRevenue: 0,
    totalDownloads: 0,
    androidDownloads: 0,
    iosDownloads: 0,
  }

  for (let i = 0; i < 2; i++) {
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

  console.log('currentGacha:', currentGacha)

  await browser.close()

  return currentGacha
}
