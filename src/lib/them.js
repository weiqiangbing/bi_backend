import { defaultThem, defaultField } from '../lib/config'
export default {
    changeThem(them){  
        switch (them){ 
            case 'legendnovelapp':
                return {themName:'legend', domainName:'https://cqscrest.legendnovel.com/'}
            // break;
            case 'hrxsapp':
                return {themName:'fiery', domainName:'https://cqscrest.legendnovel.com/'}
            default:
                return {themName: defaultThem, domainName: defaultField}
        }
    }
}