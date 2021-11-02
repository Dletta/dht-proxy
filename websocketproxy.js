const debug = true

const GunProxy = function () {
  const proxy = {};
  // trystero tracker
  proxy.trystero_room = {};
  // peerjs tracker
  proxy.peerjs_peer = {};
  proxy.peerjs_conn = {};
  // initialize to receive back the proxy object for a specific configuration
  proxy.initialize = function (conf, joinRoom) {
    var config = {};
    // defaults trystero
    config.trystero_enabled = conf.trystero_enabled ?? true
    config.trystero_app_id = conf.trystero_app_id || "gun_dht"
    config.trystero_mesh_id = conf.trystero_mesh_id || "graph_universal_node"
    if(joinRoom === undefined) config.trystero_enabled = false
    //defaults peerjs
    config.peerjs_enabled = conf.peerjs_enabled ?? false
    config.peerjs_mesh_id = conf.peerjs_mesh_id || "graph_universal_node"
    //defaults hyperdht
    config.hyperdht_enabled = conf.hyperdht_enabled ?? false
    config.hyperdht_hash = conf.hyperdht_hash || "graph_universal_node"

    //Trystero Module Settings
    if(config.trystero_enabled) {
      proxy.trystero_room = joinRoom({appId: config.trystero_app_id}, config.trystero_mesh_id)
      proxy.trystero_room.onPeerJoin(id => console.log(`Trystero ID: ${id} joined`))
      proxy.trystero_room.onPeerLeave(id => console.log(`Trystero ID: ${id} left`))
      const [sendMsg, onMsg] = proxy.trystero_room.makeAction('gun-protocol')
      onMsg(proxy.receiver)
      proxy.addSender(sendMsg)
    }

    // Peer JS Module
    if(config.peerjs_enabled) {
      console.log(Peer)
      proxy.peerjs_peer = new Peer()

      proxy.peerjs_conn = proxy.peerjs_peer.connect(config.peerjs_mesh_id)

      proxy.peerjs_conn.on('open', function(){
        console.log('Peer JS connected');
      })

      proxy.peerjs_peer.on('connection', function(conn) {
        connection.on('data', function(data){
          // Will print 'hi!'
          console.log('PeerJS received', data)
          proxy.receiver(data)
        })
        proxy.addSender(conn.send)
      })

      proxy.addSender(proxy.peerjs_conn.send)
     }

    // HyperDHT Module
    if(config.hyperdht_enabled){
      console.log('hyper still needs implementation');
    }

    // WebSocketProxy definition

    const WebSocketProxy = function (url) {
      const websocketproxy = {};

      websocketproxy.url = url || 'ws:proxy';
      proxy.proxyurl = url || 'ws:proxy';
      websocketproxy.CONNECTING = 0;
      websocketproxy.OPEN = 1;
      websocketproxy.CLOSING = 2;
      websocketproxy.CLOSED = 3;
      websocketproxy.readyState = 1;
      websocketproxy.bufferedAmount = 0;
      websocketproxy.onopen = function () {};
      websocketproxy.onerror = function () {};
      websocketproxy.onclose = function () {};
      websocketproxy.extensions = '';
      websocketproxy.protocol = '';
      websocketproxy.close = {code:'4', reason:'Closed'};
      websocketproxy.onmessage = function(){}; //overwritten by gun
      websocketproxy.binaryType = 'blob';
      websocketproxy.send = proxy.sender;

      return websocketproxy
    }

    return WebSocketProxy
  };

  proxy.listeners = [];

  proxy.addListener = function (listener) {
    proxy.listeners.push(listener)
  };

  proxy.receiver = function (data) {
    if(debug)console.log('----------> Receiver')
    if(debug)console.log(data)

    proxy.listeners.forEach((fn, i) => {
      fn(data)
    });

  };

  proxy.senders = [];

  proxy.addSender = function (sender) {
    proxy.senders.push(sender)
  };

  proxy.sender = function (msg) {
    if(debug)console.log('<---------- Sender')
    if(debug)console.log(msg)
    proxy.senders.forEach((fn, i) => {
      if(debug)console.log(fn)
      fn(msg)
    });

  }

  proxy.attachGun= function (gun) {
    proxy.addListener(gun._.opt.peers[proxy.proxyurl].wire.onmessage)
  }

  proxy.shutdown = function () {
    proxy.peerjs_conn.close()
    proxy.trystero_room.leave()
  };

  return proxy
}
