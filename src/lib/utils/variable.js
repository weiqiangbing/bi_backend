import comm from './comm'

// url中的参数,返回对象
export var params = (()=> {
    var url = window.location.href
    // let url = window.location.origin+'?'+'user_id=24?event_id=53&old=34?dd=df&name=wqb#/rechargeActivities'
    var hash;
    var newUrl = url.slice(url.indexOf('?') + 1)
    var myJson = {};
    if(newUrl.indexOf(window.location.hash) != -1){
    newUrl = newUrl.replace(window.location.hash, '')
    }
    newUrl = comm.mapReplace(newUrl,'?','&')
    var hashes = newUrl.split('&')
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
})()