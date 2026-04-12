import { st } from "../../bootstrap/st/st";
import config from "../../config";

// Basic functions
export class outer {
  static has(roles: string): boolean {
    if (roles === "all") return true;
    const userRoles = (st as any).roles || [];
    const userRoleNames = userRoles.map((role: any) => role.name);
    const rolesToCheck = roles.split("|");
    return rolesToCheck.some((role) => userRoleNames.includes(role));
  }

  static inArrayObject<T extends Record<string, any>>(
    arobj: T[] | null,
    needle: any,
    property: keyof T = "id" as keyof T
  ): boolean {
    if (!arobj) return false;
    return arobj.some((obj) => obj[property] === needle);
  }

  static toggleArrayItem<T extends string | number>(
    array: T[] | null,
    item: T
  ): T[] {
    const itemToToggle = isNaN(Number(item)) ? item : (Number(item) as T);

    if (!array) return [itemToToggle];

    const index = array.indexOf(itemToToggle);

    return index > -1
      ? [...array.slice(0, index), ...array.slice(index + 1)]
      : [...array, itemToToggle];
  }

  static pluckIds<T extends { id: number | string }>(arr: T[] | null): (number | string)[] {
    if (!arr) return [];
    return arr.map((obj) => obj.id);
  }

  static getLabel(name: string): string {
    const parts = name.split("_");
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    return parts.join(" ");
  }

  static getDate(dateString: string | null = null): string {
    let date: Date;

    if (dateString === "local") {
      const lastEntryDate = localStorage.getItem("last_entry_date");
      if (lastEntryDate) {
        date = new Date(lastEntryDate);
      } else {
        date = new Date();
        date.setDate(date.getDate() - 1);
      }
    } else if (dateString) {
      date = new Date(dateString);
    } else {
      date = new Date();
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static displayDate(dateString: string | null, type?: "month" | "full"): string {
    const date = new Date(dateString ?? "");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getFullYear();

    if (type === "month") return month;
    return `${month} ${day}, ${year}`;
  }

  static getYear(date?: string): number {
    const newDate = date ? new Date(date) : new Date();
    return newDate.getFullYear();
  }

  static getMonth(date?: string): number {
    const newDate = date ? new Date(date) : new Date();
    return newDate.getUTCMonth() + 1;
  }

  static skipNullData<T extends Record<string, any>>(data: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== null
      )
    ) as Partial<T>;
  }

  static showImage(
    img: string | null | undefined,
    type?: string | null,
  ): string {
    if (img && type == 'original') return `${config.server}/media/uploads/${img}`;
    if (img && type) return `${config.server}/media/uploads/${this.insertTypePrefix(img, type)}`;
    return `${config.images}/placeholder.png`;
  }

  static insertTypePrefix(filename: string, type: string): string {
    const lastSlashIndex = filename.lastIndexOf('/');
    const dir = filename.substring(0, lastSlashIndex + 1);
    const baseName = filename.substring(lastSlashIndex + 1);
    
    const newFileName = `${type}-${baseName}`;
    return `${dir}${newFileName}`;
  }

}
