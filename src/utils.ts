/**
 * Lightweight utility functions replacing lodash dependencies.
 * Covers: get, set, cloneDeep, isPlainObject
 */

/**
 * Parse a dot-notation path string into an array of keys.
 * Supports bracket notation: "a.b[0].c" → ["a", "b", "0", "c"]
 */
function parsePath(path: string): string[] {
  if (!path) return []
  const result: string[] = []
  const regex = /[^.[\]]+/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(path)) !== null) {
    result.push(match[0])
  }
  return result
}

/**
 * Get a value from an object by dot-notation path.
 * @example get({ a: { b: 1 } }, 'a.b') // → 1
 */
export function get(obj: any, path: string): any {
  if (obj == null) return undefined
  const keys = parsePath(path)
  let current = obj
  for (const key of keys) {
    if (current == null) return undefined
    current = current[key]
  }
  return current
}

/**
 * Set a value on an object by dot-notation path, creating intermediate
 * objects/arrays as needed.
 * @example set({}, 'a.b', 1) // → { a: { b: 1 } }
 */
export function set(obj: any, path: string, value: any): any {
  if (obj == null || typeof obj !== 'object') return obj
  const keys = parsePath(path)
  if (keys.length === 0) return obj

  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    if (current[key] == null || typeof current[key] !== 'object') {
      // Create array if next key is numeric, otherwise object
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
  return obj
}

/**
 * Deep clone a value.
 * Uses manual recursive cloning to support objects containing
 * non-serializable values like functions/constructors (used in schemas).
 */
export function cloneDeep<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.map(item => cloneDeep(item)) as unknown as T
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T
  }

  const result = Object.create(Object.getPrototypeOf(value))
  for (const key of Object.keys(value)) {
    (result as any)[key] = cloneDeep((value as any)[key])
  }
  return result
}

/**
 * Check if a value is a plain object (not null, not array, not Date, etc.)
 */
export function isPlainObject(value: any): value is Record<string, any> {
  if (value === null || value === undefined) return false
  if (typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}
