export interface Answers {
  mode: 'full' | 'partial'
  partial: string
  timeout: number
  table: string
  perms: boolean
  defaultTimeout: boolean
  currentTable: boolean
}
