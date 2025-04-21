import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'fsauth',

  projectId: 's33vmf0y',
  dataset: 'production',
  token:
    'skFKmtZ9vjgZ6TtpllKxFxnhbv5XL9ZksQrof3NjoK5NkKw4zh9ewNTmMZDpiNJKXTcUxV0LqftodoUtxUIGSDoFhFcJzBdy8PaihUI58C0vq8wdiyP96r0NlviDfBuUUcrJvBupy3TnwMs7zdO8F1HfT7MEpzIE1PVWHDuzb9NNXfMD9x8J',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
