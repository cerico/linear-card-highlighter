let BODY_CLASS = "loaded"

const observeMutation = () => {
  console.log("observeMutation")
  const options = {
    childList: true,
    subtree: true
  }

  const observer = new MutationObserver(handleMutation)
  const body = document.body

  observer.observe(body, options)
}

const isTodoSpan = (node) => {
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && node.textContent.trim() === 'Todo') {
    return true
  }
  for (let child of node.childNodes) {
    if (isTodoSpan(child)) {
      return true
    }
  }
  return false
}

const cardClass = (className) => {
  const cards = Array.from(document.getElementsByClassName(className))
  if (cards.length === 0) {
    console.log("no cards")
    return
  }
  cards.forEach(setTrim)
}

const handleMutation = (mutations) => {
  console.log("handleBodyMutation")
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      for (let addedNode of mutation.addedNodes) {
        if (isTodoSpan(addedNode)) {
          const CARD_CLASS = addedNode.getElementsByTagName('A')[0].classList[0]
          cardClass(CARD_CLASS)
        }
      }
    }
  }
}

const waitUntilElementReady = async (className) => {
  console.log("waitUntilElementReady")
  while ((elements = document.getElementsByClassName(className)).length < 1) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

const setTrim = (card) => {
  const element = card.querySelector('[aria-label="Open project…"]')
  const fillColor = getComputedStyle(element.getElementsByTagName('path')[0]).fill
  card.style.borderColor = fillColor
  card.classList.add('modified-card')
}

const initialize = async () => {
  console.log("initialize")
  observeMutation()
  await waitUntilElementReady(BODY_CLASS)
}

initialize()
