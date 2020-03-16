import { defaultThem } from '../lib/config'
export default {
    changeThem(them){  
        switch (them){ 
            case 'legendnovelapp':
                return 'fiery'
            // break;
            case 'light':
                return 'legend'
            default:
                return defaultThem
        }

    }
}