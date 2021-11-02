# dht-proxy
A proxy to bridge discovery over DHTs of all kinds for the Gun Protocol

## How it works

Gun uses websockets to communicate with other nodes. Overwriting the websocket, we can add any transport we want using the facade pattern.

Doing this we can use truly decentralized entry points to connect to each others data.

## Roadmap and Goals

The main goal is a decentralized DHT / Discovery mechanisms. Gone are the days of having to start your own bootstrap relay peers just to use as a gateway to other peers. How about just connecting to a common gun networking hash and discovering all the data found there? Sounds too good to be true?

Sorry to disappoint, but it actually works.

- [X] Trystero Gun DHT App with Room (Mesh)
- [ ] Trystero Add configurable Mesh Name
- [ ] PeerJs Gun DHT integration
- [ ] HyperDHT integration


Connecting across these technologies, we no longer need to worry about 'finding' or having 'access to' gun peer urls. 

![ezgif com-gif-maker (26)](https://user-images.githubusercontent.com/1423657/139880482-e07b8ac3-ec8d-45da-a35a-5c76af862090.gif)


> A gun walks into a bar and the barman asks: "Which protocol do you speak?" The gun answers: "Any."

## Contributions welcome

Fork it, PR it, make it better for all of us.

## License

MIT (C) Dletta 2021
