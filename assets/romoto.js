/**
 * Romoto
 * Roku Remote Chrome Extension
 * by djorborn
 * Jan 2019
 */

var ipInput = document.getElementById('ip')
var remote = document.getElementsByClassName('remote')[0];
var settings = document.getElementsByClassName('settings')[0];
var btns = document.getElementsByClassName('button');
var saveButton = document.getElementById('save');
var colorPallet = document.getElementsByClassName('color-pallet')[0].childNodes

chrome.storage.sync.get(['ip', 'theme'], function (data) {
  console.log(data)
  if (!data.ip) { 
    ipInput.value = '192.168.1.2'
    if (data.theme) remote.classList.add(data.theme);
    if (!data.theme) remote.classList.add('dark')
  } else {
    ipInput.value = data.ip
    if (data.theme) remote.classList.add(data.theme);
    if (!data.theme) remote.classList.add('dark')
  }
})


for (color in colorPallet) {
  colorPallet[color].onclick = function (e) {
    clearClass()
    remote.classList.add(this.classList[0])
    document.getElementById('theme').value = this.classList[0]
  }
}

function clearClass() {
  for (color in colorPallet) {
    remote.classList.remove(colorPallet[color].classList)
  }
}

for (btn in btns) {
  btns[btn].onclick = function () {
    if (this.name === 'settings') {
      settings.classList.add('show');
    } else {
      fetchKeypress(ipInput.value, this.name);
    }
  }
}

function fetchKeypress(ip, key) {
  fetch(`http://${ip}:8060/keypress/${key}`, {method: 'POST'})
}

saveButton.onclick = function () {
  settings.classList.remove('show');
  chrome.storage.sync.set({
    ip: ipInput.value,
    theme: document.getElementById('theme').value
  }, function() {
    console.log(document.getElementById('theme').value)
    console.log('Settings Updated')
  })
}

window.onkeyup = function (e) {
    console.log(e.keyCode)
    switch(e.keyCode) {
        case 37:
            fetchKeypress(ipInput.value, 'left');
            break;
        case 38:
            fetchKeypress(ipInput.value, 'up');
            break;
        case 39:
            fetchKeypress(ipInput.value, 'right')
            break;
        case 40:
            fetchKeypress(ipInput.value, 'down')
            break;
        case 8:
            fetchKeypress(ipInput.value, 'back')
            break;
        case 36:
            fetchKeypress(ipInput.value, 'home')
            break;
        case 13:
            fetchKeypress(ipInput.value, 'select')
            console.log('enter');
            break;
    }
}
