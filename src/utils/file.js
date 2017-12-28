import lrz from 'lrz'

/**
 * 读取文件, 返回 {base64, fileName} 对象，options可选为{min:boolean,quality:float,accept:string}
 */
export function readerFile (file, options = {}) {
  options = options || {}
  if (options.min) {
    return minFile(file, {
      quality: options.quality || 0.5
    })
  }
  return new Promise(function (resolve, reject) {
    let reader = new window.FileReader()

    reader.onload = function () {
      resolve({
        base64: reader.result,
        fileName: file.name
      })
    }
    reader.onerror = reject

    if (options.accept && !new RegExp(options.accept).test(file.type)) {
      reject({
        code: 1,
        msg: 'wrong file type'
      })
    }

    if (!file.type || /^text\//i.test(file.type)) {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}

/**
 * 压缩图片
 */
export function minFile (file, { quality }) {
  return lrz(file, { quality })
    .then(result => {
      return {
        base64: result.base64,
        fileName: result.origin.name
      }
    })
}
