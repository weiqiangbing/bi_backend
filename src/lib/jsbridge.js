
(function () {
    var callbackSet = {}
    window.InteractorProxy = {
        callbackHandler: callbackHandler,
        registerHandler: registerHandler,
        version: 6
    };

    function callbackHandler(data) {
        var callback = callbackSet[data.name];
        callback(data.params);
        delete callbackSet[data.name]
    }

    function registerHandler() {
        InteractorProxy.app = {
            version: "1.6.0",
            scheme: "legendnovelapp",
            platform: "Android",
            system: "test"
        }
        var interactorReadyEvent = document.createEvent("Events");
        interactorReadyEvent.initEvent("onInteractorReady");
        interactorReadyEvent.InteractorProxy = InteractorProxy;
        document.dispatchEvent(interactorReadyEvent);
    }

    InteractorProxy.showMessageToast = function(message){
        var request = {"message": message}
        
        alert(message)
    }

    /**
     * {id: 111}
     */
    InteractorProxy.getUserInfo = function(){
        return {
            id: 123456
        }
    }

    InteractorProxy.startWechatPay = function(amount, channel, type){
        if(arguments.length == 3){
            alert("启动微信支付")
        }
    }

    InteractorProxy.startAlipay = function(amount, channel, type){
        if(arguments.length == 3){
            alert("启动支付宝支付")
        }
    }

    InteractorProxy.login = function() {
        console.log("请求客户端登陆：test")
        var host = document.location.host
        document.cookie = "token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; path=/; domain="+host+";"
        
    }

    InteractorProxy.openAppMarket = function() {
        alert("前往应用商店")
    }

    InteractorProxy.logEvent = function(eventName, params) {
        console.log(eventName + ":" + params)
    }

    InteractorProxy.open = function(path, params) {
        if(path == undefined) return;

        if(arguments.length <=1){
           params = {}
        }

        alert("跳转页面："+path + "#"+params)
    }

    function pushCallback(fn){
        var id = new Date().getTime() + "=="
        callbackSet[id] = fn
        return id
    }

})();