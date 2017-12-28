export const hasClass = (element, cls) => {
  if (!element || cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (element.classList) {
    return element.classList.contains(cls)
  } else {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export const addClass = (element, cls) => {
  if (!element) return
  if (hasClass(element, cls)) return
  if (element.classList) {
    element.classList.add(cls)
  } else {
    element.className += ' ' + cls
  }
}

export const removeClass = (element, cls) => {
  if (!element || !cls) return
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (element.classList) {
    element.classList.remove(cls)
  } else {
    element.className = (' ' + element.className + ' ').replace(' ' + cls + ' ', ' ').trim()
  }
}
