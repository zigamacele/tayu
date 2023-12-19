import { startGatheringInformation } from './logic/configuration'
import { displayTitle } from './utils/display'

const app = () => {
  displayTitle()
  void startGatheringInformation()
}

app()
