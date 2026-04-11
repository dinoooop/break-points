
import type { OptionItem, SocialMediaItem } from "./interfaces.ts";
import sta from "./sta";
import { stb } from "./stb";

// Static data store and manipulation
export class st {

    static roles(needle: string | number = 0): string | number | OptionItem[] {
        const data = sta.roles;
        if (needle) { return stb.propFindValue(needle, data); }
        return data;
    }

    static gender(): OptionItem[] {
        const data = sta.gender;
        return stb.propOption(data);
    }

    static regularStatus(): OptionItem[] {
        const data = sta.regularStatus;
        return stb.propOption(data);
    }

    static userStatus(): OptionItem[] {
        const data = sta.userStatus;
        return stb.propOption(data);
    }

    static week(needle: string | number = 0): string | number | OptionItem[] {
        const data = sta.week;
        if (needle) { return stb.propFindValue(needle, data); }
        return data;
    }

    static month(needle: string | number = 0): string | number | OptionItem[] {
        const data = sta.month;
        if (needle) { return stb.propFindValue(needle, data); }
        return data;
    }

    static socialMedia(): SocialMediaItem[] {
        return sta.socialMedia;
    }

    static brands(needle: string | number = 0): string | number | OptionItem[] {
        const data = sta.brands;
        if (needle) { return stb.propFindValue(needle, data); }
        return data;
    }
}
