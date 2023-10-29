To be able to use this project you'd need to start at least 2 grapes and connect them to each other. More info [here](https://blog.bitfinex.com/tutorial/bitfinex-loves-microservices-grenache/)

To install the repository you must clone it, navigate inside of it, and install its dependencies:
```
git clone https://github.com/muthandir/grenache-challenge
npm i
```

Then you can run tests as follows:
```
npm run test
```

- Because this exercise required a distributed order handling, I've created an order processor that is both a peer client and server.

- I've initially wanted to create an order processor that behaves both as pub/sub peer. But subscribers only received messages from a single publisher, and I could not make it work in the given timeframe of the exercise, that is why I switched to client/server approach for not wasting too much time.

- You can run npm start in different tabs and it will spawn multiple order processors.

- One thing that concerns me is the lack of additional tests. I could come up with a good testing suite if I had a couple of extra hours. 

- Because the system would normally receive the orders from an API/queue etc I created the order processor as a library.