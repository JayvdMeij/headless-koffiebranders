import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './env'

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'spaarne-koffiebranders',
  typegen: {
    path: '../queries/**/*.ts',
    schema: 'schema.json',
    generates: '../types/sanity.types.ts',
    overloadClientMethods: true,
  },
})
