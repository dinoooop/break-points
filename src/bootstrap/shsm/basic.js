export class basic {
    static singlularize(str) {
        if (str === undefined || str === null || str === '') {
            return '';
        }

        if (str.endsWith('s')) {
            return str.slice(0, -1);
        }
        return str;
    }

    static random(start, end) {
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }

    static randList(theList) {
        const randomIndex = this.random(0, theList.length - 1);
        return theList[randomIndex];
    }

    static toggleArrayItem(array, item) {
        const index = array.indexOf(item);
        if (index > -1) {
            // Item exists, remove it
            return array.filter(i => i !== item);
        } else {
            // Item doesn't exist, add it
            return [...array, item];
        }
    }
}