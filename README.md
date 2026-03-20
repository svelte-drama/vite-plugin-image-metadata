# vite-plugin-image-metadata

A Vite plugin that imports image files with their dimensions. Append `?image` to any image import to get back the `src`, `width`, and `height`.

## Installation

```bash
npm install vite-plugin-image-metadata
```

## Setup

```js
// vite.config.ts
import { defineConfig } from 'vite'
import imageMetadata from 'vite-plugin-image-metadata'

export default defineConfig({
  plugins: [imageMetadata()]
})
```

## Usage

```js
import Eevee from './133_us.png?image'
const { height, width, src } = Eevee
```
