import config from "../../config.js";
import { caps } from "./caps.js";

export const has = (cap, param) => {

    // Initialise basic variables
    const user = config.authUser;
    const role = user.role;
    const roleCaps = caps[role] ?? [];

    switch (cap) {
        case 'view_':
        case 'manage_':
            // role is not defined
            if(!param){
                // param not set (user id)
                // this is profile page, not user edit page, allow to edit
                return true;
            }
            
            return false;
    
        default:
            return roleCaps.includes(cap)? true : false;
    }
}