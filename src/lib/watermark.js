let setWatermark = (str1, str2, str3) => {
    let id = '1.23452384164.123412415'
        if (document.getElementById(id) !== null) {
            document.body.removeChild(document.getElementById(id))
        }
        let can = document.createElement('canvas')
        can.width = 270
        can.height = 100
        let cans = can.getContext('2d')
        cans.rotate(-20 * Math.PI / 180)
        cans.font = '17px Vedana'
        cans.fillStyle = '#666667'
        cans.textAlign = 'center'
        cans.textBaseline = 'Middle'
        cans.fillText(str1, can.width / 2, can.height)
        cans.fillText(str2, can.width / 2, can.height + 20)
        cans.fillText(str3, can.width / 2, can.height + 40)
        let div = document.createElement('div')
        div.id = id
        div.style.pointerEvents = 'none'
        div.style.top = '20px'
        div.style.left = '0px'
        div.style.opacity = '0.15'
        div.style.position = 'fixed'
        div.style.width = document.documentElement.clientWidth + 'px'
        div.style.height = document.documentElement.clientHeight + 'px'
        div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
        document.body.appendChild(div)
        return id
    }
    // 添加水印
    export const setWaterMark = (str1, str2, str3) => {
        let id = setWatermark(str1, str2, str3)
        if (document.getElementById(id) === null) {
            id = setWatermark(str1, str2, str3)
        }
    }
    // 移除水印
    export const removeWatermark = () => {
        let id = '1.23452384164.123412415'
        if (document.getElementById(id) !== null) {
            document.body.removeChild(document.getElementById(id))
        }
    }