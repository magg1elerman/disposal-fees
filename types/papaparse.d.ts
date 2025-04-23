declare module "papaparse" {
  export interface ParseConfig {
    delimiter?: string
    newline?: string
    quoteChar?: string
    escapeChar?: string
    header?: boolean
    dynamicTyping?: boolean
    preview?: number
    encoding?: string
    worker?: boolean
    comments?: boolean | string
    download?: boolean
    skipEmptyLines?: boolean | "greedy"
    fastMode?: boolean
    withCredentials?: boolean
    delimitersToGuess?: string[]
    chunk?: (results: ParseResult<any>, parser: Parser) => void
    beforeFirstChunk?: (chunk: string) => string | void
    transform?: (value: string, field: string | number) => any
    complete?: (results: ParseResult<any>, file: File) => void
    error?: (error: Error, file: File) => void
    step?: (results: ParseStepResult<any>, parser: Parser) => void
  }

  export interface ParseResult<T> {
    data: T[]
    errors: Array<{
      type: string
      code: string
      message: string
      row: number
    }>
    meta: {
      delimiter: string
      linebreak: string
      aborted: boolean
      truncated: boolean
      cursor: number
    }
  }

  export interface ParseStepResult<T> {
    data: T[]
    errors: Array<{
      type: string
      code: string
      message: string
      row: number
    }>
    meta: {
      delimiter: string
      linebreak: string
      aborted: boolean
      truncated: boolean
      cursor: number
    }
  }

  export interface Parser {
    abort: () => void
    pause: () => void
    resume: () => void
  }

  export function parse<T>(input: string, config?: ParseConfig): ParseResult<T>
  export function unparse(data: any, config?: any): string
}
