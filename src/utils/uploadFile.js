import request from '@/utils/request'

// 上传文件
export function uploadFileFun(url, fileName, file, otherData){
    var formData = new FormData()
    formData.append(fileName, file)
    for(let i in otherData){
        formData.append(i, otherData[i])
    }
    return request({
        url: url,
        method: 'post',
        data: formData
    })
}

// 将url转为file格式
export function getFile(url, filename) { 
    // url = location.origin+'/'+url
    console.log('url',url);
    return new Promise((resolve, reject)=>{
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
            // console.log(xhr.response)
            const blob = xhr.response
            var files = new window.File([blob], `${filename}.${blob.type.split('/')[1]}`, { type: blob.type })
            // console.log('files22',files);
            if(files){
                resolve(files)
            }else{
                reject()
            }
        }
        xhr.send()
    })
}