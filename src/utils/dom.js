/**
 * img标签的dom元素获取图片的信息
 * @param {*} imgElement
 */
export const getImgData = (imgElement) => {
  return {
    w: imgElement.naturalWidth || 100,
    h: imgElement.naturalHeight || 100,
    src: imgElement.src
  }
}

/**
 * 获取查看图片的参数
 * @param currentImg 当前图片dom或者src
 * @param imgsRoot 查看图片的root dom
 * @returns {{index: number, items: Array}}
 */
export const getCheckPhotoOptions = (currentImg, imgsRoot, imgSelector = 'img') => {
  const imgNodeList = imgsRoot.querySelectorAll(imgSelector)
  let index = -1
  const items = nodeListToArray(imgNodeList).map((img, i) => {
    if (index === -1 && (img === currentImg || img.src === currentImg)) {
      index = i
    }
    return getImgData(img)
  })

  if (index === -1) {  // 没找到对应图片，则取第一张
    index = 0
  }

  return {
    index,
    items
  }
}

/**
 * 把NodeList对象转换成普通的Array对象，ie可能有兼容问题
 * @param {*} nodeList
 */
export const nodeListToArray = (nodeList) => {
  return Array.prototype.slice.call(nodeList)
}
