import * as dotenv from 'dotenv'
import puppeteer from 'puppeteer'
dotenv.config()
import config from './config/envVariables'

type Gacha = {
  name?: string
  revenue?: string
  downloads?: string
  platform?: string
}

const find = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  process.env && (await page.goto(config.website['URL']))

  await page.setViewport({
    width: 640,
    height: 480,
  })

  const currentGacha = 'Genshin Impact'

  await page.type('.MuiInputBase-input', currentGacha)

  const searchResultSelector = '.SearchAppResult-module__root--P1frD'
  await page.waitForSelector(searchResultSelector)

  const elements = await page.$$(searchResultSelector)

  const monthlyRevenue: Gacha[] = []

  for (let i = 0; i < 2; i++) {
    const currentGacha: Gacha = {}
    const element = elements[i]

    const name = await element?.$(
      '.MuiTypography-root.MuiTypography-h4.MuiTypography-noWrap.css-9vlcts',
    )

    currentGacha['name'] = await name?.evaluate((el) => el.textContent)

    const isRevenueForAndroid = await element?.$$eval(
      '[data-test="Android"]',
      (elements) => elements.length > 0,
    )
    currentGacha['platform'] = isRevenueForAndroid ? 'Android' : 'iOS'

    const statistics =
      '.MuiTypography-root.MuiTypography-small.SearchAppResult-module__mediumEmphasis--W5uvW.css-11j76p1'

    await element?.waitForSelector(statistics)

    const stats = await element?.$$(statistics)

    if (stats) {
      for (const stat of stats) {
        const currentStat = await stat.evaluate((el) => el.textContent)
        if (currentStat?.includes('$')) {
          currentGacha['revenue'] = currentStat
        } else {
          currentGacha['downloads'] = currentStat
        }
      }
    }

    monthlyRevenue.push(currentGacha)
  }

  console.log('monthlyRevenue:', monthlyRevenue)

  await browser.close()
}

find()
