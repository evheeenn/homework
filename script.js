const block = document.createElement("div")
const parent = document.querySelector('body')
block.className = 'block'
parent.append(block)

async function moveBlock() {
  
  const randomX = Math.floor(Math.random() * window.innerWidth)
  const randomY = Math.floor(Math.random() * window.innerHeight)

  
  const blockWidth = block.offsetWidth
  const blockHeight = block.offsetHeight

  const maxX = window.innerWidth - blockWidth
  const maxY = window.innerHeight - blockHeight

  const x = Math.max(0, Math.min(randomX, maxX))
  const y = Math.max(0, Math.min(randomY, maxY))

  
  block.style.top = y + "px"
  block.style.left = x + "px"
  
}

function generateRandomColor() {
  const randomColor = Math.random().toString(16).slice(2, 8);

  block.style.background = '#' + randomColor
}

setInterval(moveBlock, 1000)
setInterval(generateRandomColor, 1000)