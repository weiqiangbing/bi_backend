export default{
    waitLoad(callback){
        var terval = setInterval(() => {
            if(window.InteractorProxy && window.InteractorProxy.app){
                clearInterval(terval)
                callback()        
            }
        }, 50);
    }
}