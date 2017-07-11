const table = require('./modules/savaData.js')
const axios = require('axios')
const download = require('./modules/saveImg.js')
let datas = []
let currPage = 1
let goOn = true
const req = axios.create({
  baseURL: 'https://www.douban.com/',
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  }
})

function fetchGameList (success, fail) {
  req.get('j/ilmen/game/search?sort=rating&more=' + currPage).then(success).catch(fail)
}

function fetchGameListSuccess (res) {
  currPage++
  datas = datas.concat(res.data.games)
  console.log('------------------获取列表 当前为第' + (currPage - 1) + '页---------------')
  console.log('当前数据条数:' + datas.length)
  console.log('数据总数:' + res.data.total)
  if (goOn) {
    fetchGameList(fetchGameListSuccess, fetchGameListfailed)
  }
}

function fetchGameListfailed (res) {
  if (res.response.status === 500) { // 为500时候没有数据了,开始存入数据库
    goOn = false
    console.log('--------------------------列表爬取完毕------------------------')
    console.log(datas.length)
    table.save(datas, 0)
    download.downloadImg(datas, 0)
  } else {
    console.log('----------------------------未知错误--------------------------')
  }
}

download.clearDir(function () {
  fetchGameList(fetchGameListSuccess, fetchGameListfailed)
})
