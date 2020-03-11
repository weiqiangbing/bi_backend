export default {
    changeThem(them){        
        switch (them){ 
            case 'blank':
                require ('../assets/css/thems/block.less')
            break;

            case 'light':
                 require ('../assets/css/thems/light.less')
            break;

        }

    }
}