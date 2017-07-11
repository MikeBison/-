const fs = require('fs')
const axios = require('axios')
const path = require('path')
const imgDir = path.join(__dirname, '../img')

function clearDir (callback) {
  fs.access(imgDir, fs.constants.F_OK, function (err) {
    if (err) {
      fs.mkdir(imgDir)
    } else {
      let files = fs.readdirSync(imgDir)
      files.forEach(function (item) {
        fs.unlinkSync(path.join(imgDir, item))
      })
      callback()
    }
  })
}

function downloadImg (arr, index) {
  if (index >= arr.length) {
    console.log('-------------------------------------图片下载完毕-----------------------------------------')
    console.log('共下载图片:' + index + '张')
    return
  }
  let item = arr[index]
  axios({
    method: 'get',
    url: item.cover,
    responseType: 'stream'
  }).then(function (res) {
    res.data.pipe(fs.createWriteStream(path.join(imgDir, path.basename(item.cover))))
  }).then(function () {
    downloadImg(arr, index + 1)
  }).catch(function (e) {
    console.log(e)
  })
}

module.exports = {
  clearDir,
  downloadImg
}
