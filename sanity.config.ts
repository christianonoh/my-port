import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'
import { myTheme } from './theme'
import StudioNavbar from './app/(site)/components/global/StudioNavbar'
import Logo from './app/(site)/components/global/Logo'

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
  theme: myTheme,
  studio: {
    components: {
      logo: Logo,
      navbar: StudioNavbar,
    },
}
})

export default config;