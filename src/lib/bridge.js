//判断机型
let u = navigator.userAgent;

function setupWebViewJavascriptBridge(callback) {
  //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  //判断ios 还是Android
  if (/(iPhone|iPad|iPod|iOS)/i.test(u)) {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

//安卓注册事件监听
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        callback(WebViewJavascriptBridge)
      },
      false
    );
  }
}

connectWebViewJavascriptBridge(function (bridge) {
  //初始化
  if (!/(iPhone|iPad|iPod|iOS)/i.test(u)) {
    console.log("初始化")
    bridge.init(function (message, responseCallback) {
      //var data = {'Javascript Responds': 'Wee!'};
      responseCallback(data);
    });
  }
});


export default {
    // h5调用原生的方法
  callHandler(name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
    //原生调用h5的方法   
  registerhandler(name, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(name, function (data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  }
}