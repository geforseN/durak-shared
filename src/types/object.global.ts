export {}

declare global {
  interface ObjectConstructor {
    fromEntries<K extends PropertyKey, T = unknown>(
      entries: Iterable<readonly [K, T]>,
    ): Record<K, T>;
  }
}
