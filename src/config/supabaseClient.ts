import { createClient } from '@supabase/supabase-js'

import config from './envVariables'

const supabase = createClient(
  config.database['HOST'],
  config.database['SECRET'],
  {
    auth: {
      persistSession: false,
    },
  },
)

export default supabase
