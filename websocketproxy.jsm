

var self;

export WebSocketProxy = class WebSocketProxy {
  constructor(url) {
    self = this
    this.url = '' //this would be the hash, I guess or is replaced with whatever var is needed
    this.CONNECTING = 0
    this.OPEN = 1
    this.CLOSING = 2
    this.CLOSED = 3
    this.readyState = 1
    this.bufferedAmount = 0
    this.onopen = function () {}
    this.onerror = function () {}
    this.onclose = function () {}
    this.extensions = ''
    this.protocol = ''
    this.close = {code:'4', reason:'Closed'}
    this.onmessage = function (){}
    this.binaryType = ''
    this.send = function(data) {
      sendMsg(data)
    }
    this.sendingProxy = function () {
    }
  }

  setSender(func) {
    console.log('setting new function on send');
    self.send = sendMsg
  }

  callMessage(msg){
    console.log(' "receiving" ', msg, self);
    self.onmessage(msg)
  }
}

//enumerate peers
function wireUp(){
  var peers = gun._.opt.peers

  for (var peer in peers) {
    console.log(peer, peers[peer], peers[peer].wire);
    peers[peer].wire.setSender(function(msg) {
      sendMsg(msg)
    })
    onMsg(peers[peer].wire.callMessage)
  }

  gun.get('trystero-test').get('hallo').put(Math.random()*100)

  gun.get('trystero-test').get('hallo').on((val, key)=>{
    console.log('OTHER PEER key: ' +key +"; val: " + val)
    var out = document.getElementById('output')
    out.innerText = 'key: ' +key +"; val: " + val + ";"
  })
}
