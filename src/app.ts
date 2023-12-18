import { startGatheringInformation } from './logic/configuration'
import { displayTitle } from './utils/display'

const main = () => {
  displayTitle()
  void startGatheringInformation()
}

void main()
