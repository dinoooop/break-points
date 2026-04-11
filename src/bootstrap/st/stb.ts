import type { OptionItem } from "./interfaces";

export class stb {

  static labelCase(str: string): string {
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c: any) => c.toUpperCase());
  }

  static propFindValue(needle: number | string, data: OptionItem[]): number | string {
    if (typeof needle === "string") {
      const found = data.find(item => item.label === needle);
      if (found) {
        return found.value;
      } else {
        throw new Error("ST not found");
      }
    } else {
      const found = data.find(item => item.value === needle);
      if (found) {
        return found.label;
      } else {
        throw new Error("ST not found");
      }
    }
  }

  static propOption(data: string[]): OptionItem[] {
    const options = data.map(item => ({
      label: this.labelCase(item),
      value: item,
    }));
    return options;
  }
}
