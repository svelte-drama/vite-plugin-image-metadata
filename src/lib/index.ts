import sharp from 'sharp'
import type { Plugin, ViteDevServer } from 'vite'
export type { Image } from './types.ts'

const IMAGE_REGEX = /\?image$/

export default function imageMetadata(): Plugin {
	let vite_server: ViteDevServer | undefined

	return {
		name: 'image-metadata',
		enforce: 'pre',

		configureServer(server) {
			vite_server = server
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

				const getModule = async () => {
					if (vite_server) {
						return vite_server.transformRequest(`${file_path}?url`)
					} else {
						const resolved = await this.resolve(`${file_path}?url`)
						if (!resolved) return null
						return this.load(resolved)
					}
				}

				const module = await getModule()
				if (!module || !module.code) return null
				const src = module.code.replace('export default ', '')

				const { height, width } = await sharp(file_path).metadata()
				return `export default { height: ${height}, width: ${width}, src: ${src} }`
			}
		}
	}
}
