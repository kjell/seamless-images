var d3 = require('d3')
var seamlessImages = require('./seamless-images')

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

var hash = window.location.hash,
  initialHeight = hash.split('/')[1] || '10em',
  boxWidth = hash.split('/')[0].replace('#', '') || 100

seamlessImages(images, initialHeight, boxWidth)

