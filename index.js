var d3 = require('d3')

var image_ids = "10436 105014 107241 108860 109112 109118 109122 112568 113568 113926 114429 114514 114602 115352 115357 115358 115836 116116 116294 116725 117153 118304 12092 1218 1226 1244 1270 1348 1355 1380 1411 1629 1637 1704 1721 1727 1748 1978 2210 22412 2606 278 31247 3183 3520 376 4324 4379 43877 4418 4829 529 537 548 5788 60728 678 7505 8023 91467 9202 98653"
  .split(' ')
var no_image_ids = "116725 115352 117153 118304".split(' ')

// Shuffles the input array.
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m], array[m] = array[i], array[i] = t;
  }
  return array;
}

var images = shuffle(image_ids)
  .filter(function(i) { return no_image_ids.indexOf(i) < 0 })
  .map(function(id) { return {id: id} })

var dispatch = d3.dispatch("loaded", "loadedAll")

var loaded = 0

dispatch.on("loaded", function(image, d) {
  d.aspectRatio = image.width / image.height
  d.width = image.width
  d.height = image.height
  loaded+=1
  if(loaded == images.length) { dispatch.loadedAll(loaded) }
})

dispatch.on("loadedAll", function(all) {
  images.forEach(function(image, i) {
    image.img = imgs[0][i]
    image.y = image.img.y
  })
  grouped = images.reduce(function(grouped, image) {
    if(grouped[image.y] == undefined) grouped[image.y] = []
    grouped[image.y].push(image)
    return grouped
  }, {})
  expandRowsToFillWidth()
})

d3.select('body').style('margin', '0')

var boxWidth = window.location.hash.replace('#', '') || 50
var box = d3.select('body').append('div')
    .attr('id', 'box')
    .style({width: boxWidth+'vw'})

var imgs = box.selectAll('img')
    .data(images)
  .enter().append('img')
    .attr('src', function(d) { return d.id+".jpg" })
    .attr('onload', function(d) {
      var image = new Image
      image.src = this.src
      image.onload = function() { dispatch.loaded(image, d) }
    })
    .style({height: '10em'})

api = {
  images: images,
  box: box,
  loaded: loaded,
  update: update
}

function expandRowsToFillWidth() {
  var rows = Object.keys(grouped).map(function(key) { return grouped[key] })
  rows.forEach(function(row, i) {
    var rowWidth = row.reduce(function(width, image) { return width += image.img.width }, 0)
    var rowHeight = row[0].img.height
    // Solve for y2: what height should these images be to completely fill the row?
    var y2 = (box.node().clientWidth-2)/(rowWidth/rowHeight)
    row.forEach(function(image) {
      image.img.setAttribute('class', 'row-'+i)
      image.img.style.height = y2+'px'
    })
  })
}

var resize
function update() {
  window.cancelAnimationFrame(resize)
  resize = window.requestAnimationFrame(expandRowsToFillWidth)
}
window.addEventListener('resize', update)
