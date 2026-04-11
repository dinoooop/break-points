// validator independent fucntions
export class vri {

    static findFirstNonFalseValue(obj: Record<string, string>): string {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== '') {
                    return value;
                }
            }
        }
        
        return '';
    }
}