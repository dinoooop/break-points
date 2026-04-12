export class fm {
  static getLabel(name: string): string {
    const parts = name.split("_");
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    return parts.join(" ");
  }

  

  static findItemById<T extends { _id: string | number }>(
    id: string | number,
    haystack: T[]
  ): T | undefined {
    return haystack.find((item) => item._id === id);
  }

  static toggleArrayItem<T>(id: T, haystack: T[]): T[] {
    const index = haystack.findIndex((item) => item === id);
    return index !== -1
      ? haystack.filter((item) => item !== id)
      : [...haystack, id];
  }

  static inArray<T>(needle: T, haystack: T[]): boolean {
    return haystack.some((item) => item === needle);
  }
}
