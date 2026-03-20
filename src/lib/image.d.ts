declare module '*?image' {
	export const height: number
	export const width: number
	export const src: string

	const image: { height: number; width: number; src: string }
	export default image
}
