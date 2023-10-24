export interface Gacha {
  id: number
  totalRevenue: number
  androidRevenue: number
  iosRevenue: number
  totalDownloads: number
  androidDownloads: number
  iosDownloads: number
}

export interface GameSchema {
  id: number
  name: string
  en_name: string
  publisher: string
  developer: string
  release_date: string
  region: string
  icon: string
  background: string
  pc_client: boolean | null
  eos: boolean
  new_release: boolean
  hidden: boolean
  same_name: boolean
  same_slot: number[] | null
  blurhash: string | null
}
