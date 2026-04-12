export class vra {
    static getMin(rule: string): number {
        const min = parseInt(rule.split('|').find(r => r.startsWith('min:'))?.split(':')[1] || '');
        if (isNaN(min)) {
            return 0;
        }
        return min

    }

    static getMax(rule: string): number {
        const max = parseInt(rule.split('|').find(r => r.startsWith('max:'))?.split(':')[1] || '');
        if (isNaN(max)) {
            return 0;
        }
        return max

    }

    static getMaxSize(rule: string): number {
        const found = rule.split("|").find(r => r.startsWith("maxsize:"));
        if (!found) return 0;
        const size = parseFloat(found.split(":")[1]);
        return isNaN(size) ? 0 : size;
    }

    static getInList(rule: string): string[] {
        const found = rule.split("|").find(r => r.startsWith("in["));
        if (!found) return [];
        const match = found.match(/in\[(.*)\]/);
        if (!match || !match[1]) return [];
        return match[1].split(",").map(v => v.trim());
    }

    static getSame(rule: string): string | null {
        const parts = rule.split("|");
        for (const part of parts) {
            if (part.startsWith("same:")) {
                return part.replace("same:", "").trim();
            }
        }
        return null;
    }

}