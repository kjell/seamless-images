module.exports = function(images, imageHeight, boxWidth) {
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

  var box = d3.select('body').append('div')
      .attr('id', 'box')
      .style({width: boxWidth})

  var imgs = box.selectAll('img')
      .data(images)
    .enter().append('img')
      .attr('src', function(d) { return d.id+".jpg" })
      .attr('onload', function(d) {
        var image = new Image
        image.src = this.src
        image.onload = function() { dispatch.loaded(image, d) }
      })
      .style({height: imageHeight})

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
}

