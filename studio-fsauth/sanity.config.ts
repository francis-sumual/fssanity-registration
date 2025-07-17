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
    'skg0hdMea7xhojCmqvq1YAtkmDFSsKLymxESEVt7JijngKPJx6RrO5nYG05AJJIP1E5Y7ZiWuGhcDwlU6WqPBZ0GDbzwspwRgDGHa40dSafFx8USsaJfOsiHkg89z0URE52CFGMmTixpJacvfqJAaRa9WeGaIJvGWzCOKT7gRniekTL6ERFe',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
