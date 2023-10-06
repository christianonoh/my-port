import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'

const config = defineConfig({
  name: 'default',
  title: 'My Portfolio',

  projectId: 'n5aosvhy',
  dataset: 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

export default config;