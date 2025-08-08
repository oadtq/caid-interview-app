declare module '@ffmpeg/ffmpeg' {
  export function createFFmpeg(options?: any): any
  export function fetchFile(file: Blob | ArrayBuffer | string): Promise<Uint8Array>
}

declare module '@ffmpeg/util' {
  export function toBlobURL(url: string, type: string): Promise<string>
} 