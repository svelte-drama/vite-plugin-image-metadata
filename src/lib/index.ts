import sharp from 'sharp'
import type { Plugin, ResolvedConfig } from 'vite'
import { readFile } from 'fs/promises'
import { basename } from 'path'
export type { Image } from './types.ts'

const IMAGE_REGEX = /\?image$/

export default function imageMetadata(): Plugin {
	let config: ResolvedConfig

	return {
		name: 'image-metadata',
		enforce: 'pre',
		configResolved(resolved) {
			config = resolved
		},

		resolveId: {
			filter: {
				id: IMAGE_REGEX
			},
			async handler(id, importer) {
				const path = id.replace(IMAGE_REGEX, '')
				const resolved = await this.resolve(path, importer, { skipSelf: true })
				if (!resolved) return null
				return {
					id: resolved.id + '?image',
					moduleSideEffects: false
				}
			}
		},
		load: {
			filter: {
				id: IMAGE_REGEX
			},
			async handler(id) {
				const file_path = id.replace(IMAGE_REGEX, '')
				const file = await readFile(file_path)

				const { height, width } = await sharp(file).metadata()
				let src = ''

				if (config.command === 'serve') {
					src = `'${file_path.replace(config.root, '')}'`
				} else {
					const reference_id = this.emitFile({
						type: 'asset',
						name: basename(file_path),
						source: file
					})
					src = `import.meta.ROLLUP_FILE_URL_${reference_id}`
				}

				return `export default { height: ${height}, width: ${width}, src: ${src} }`
			}
		}
	}
}
