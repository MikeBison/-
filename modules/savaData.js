const Sql = require('sequelize')
const dataDb = new Sql('doubanGameList', 'admin', '1234', {
  host: 'localhost',
  port: '8089',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  define: {
    'underscored': true,
    'charset': 'utf8mb4'
  },
  pool: {
    max: 50,
    min: 0,
    idle: 300000
  }
})

const game = dataDb.define('game', {
  title: {
    type: Sql.STRING
  },
  gameId: {
    type: Sql.STRING
  },
  platforms: {
    type: Sql.STRING
  },
  genres: {
    type: Sql.STRING
  },
  img: {
    type: Sql.STRING
  },
  rating: {
    type: Sql.STRING
  },
  star: {
    type: Sql.STRING
  },
  url: {
    type: Sql.STRING
  }
}, { freezeTableName: true })

game.sync({
  force: true
})

function saveDataListItem (arr, index) {
  if (index >= arr.length) {
    console.log('-------------------------------------数据存储完毕-----------------------------------------')
    return
  }
  let item = arr[index]
  game.create({
    title: item.title,
    gameId: item.id,
    platforms: item.platforms,
    genres: item.genres,
    img: item.cover,
    rating: item.rating,
    star: item.star,
    url: item.url
  }).then(function () {
    saveDataListItem(arr, index + 1)
  }).catch(function (e) {
    console.error(e)
    console.log(item)
  })
}

module.exports = {
  gameList: game,
  save: saveDataListItem
}
