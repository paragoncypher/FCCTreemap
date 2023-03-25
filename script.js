const GAME_DATA = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

const HEIGHT = 720
const WIDTH = 1200

fetch(GAME_DATA)
  .then(res => res.json())
  .then(data => drawGraph(data))

function drawGraph(data) {    
  let body = d3.select("body")
  
  let tooltip = body.append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0)
  
  let svg = d3.select("#treemap")
    .attr("height", HEIGHT)
    .attr("width", WIDTH)
  
  let hierarchy = d3.hierarchy(data, node => {
    return node['children']
  }).sum(node => {
    return node['value']
  }).sort((node1, node2) => {
    return node2['value'] - node1['value']
  })
  
  let createTreemap = d3.treemap()
    .size([WIDTH, HEIGHT])
  
  createTreemap(hierarchy)
  
  let gameData = hierarchy.leaves()
    
  let cell = svg.selectAll('g')
    .data(gameData)
    .enter()
    .append('g')
    .attr('transform', game => `translate(${game['x0']}, ${game['y0']})`)
  
  cell.append('rect')
    .attr('class', 'tile')
    .attr('width', game => game['x1'] - game['x0'])
    .attr('height', game => game['y1'] - game['y0'])
    .attr('fill', game => {
      let category = game['data']['category']
      return colourSelect(category)
    })
    .attr("data-name", game => game['data']['name'])
    .attr("data-category", game => game['data']['category'])
    .attr("data-value", game => game['data']['value'])
    .attr('stroke', "#fff")
    .on('mousemove', (event, game) => {
      tooltip.style('opacity', 0.9)
        .attr('data-value', game['data']['value'])
        .text(`${game['data']['name']}: ${game['data']['value']}m units`)
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px')
    })
    .on('mouseout', (event, data) => {
      tooltip.style('opacity', 0)
        .style('left', "-200px")
        .style('top', "-200px")
    })
  
    cell.append('text')
      .text(game => game['data']['name'])
      .attr('x', 5)
      .attr('y', 10)
      .style('font-size', '8px')
      .style('fill', "#fff") 
  
  let legend = d3.select("#legend")
    .attr('width', 1200)
    .attr('height', 300)
  
  let legendCounter = 0
  
  data.children.forEach(child => {
    let legendItem = legend.append('g')
      .attr('transform', `translate(${legendCounter}, 0)`)
    
    legendCounter += 62
    
    legendItem.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', colourSelect(child.name))
      .attr('class', 'legend-item')
    
    legendItem.append('text').text(child.name)
      .attr('x', 20)
      .attr('y', 12)
      .attr('width', 200)
      .attr('height', 50)
      .style('font-size', '10px')
  })
}

function colourSelect(consoleName) {
  switch(consoleName) {
    case "Wii":
      return "#00202e"
      break
    case "GB":
      return "#003f5c"
      break
    case "SNES":
      return "#2c4875"
      break
    case "PS":
      return "#8a508f"
      break
    case "2600":
      return "#bc5090"
      break
    case "PS2":
      return "#ff6361"
      break
    case "PS3":
      return "#ff8531"
      break
    case "PS4":
      return "#ffa600"
      break
    case "PSP":
      return "#ffd380"
      break
    case "GBA":
      return "#e12729"
      break
    case "XB":
      return "#f37324"
      break
    case "XOne":
      return "#f8cc1b"
      break
    case "X360":
      return "#72b043"
      break
    case "NES":
      return "#007f4e"
      break
    case "DS":
      return "#6c584c"
      break
    case "3DS":
      return "#68a0a6"
      break
    case "N64":
      return "#adc178"
      break
    case "PC":
      return "#a98467"
      break
  }
}