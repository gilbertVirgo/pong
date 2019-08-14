const app = require('express')();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

const Game = require("./game");
const Body = require("./body");

const running = [];

server.listen(8000);

app.use(cors());

// Parsing POST params
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Live.");
});

// Create new game & room
app.get("/game", (req, res) => {
    // Init new game and add to running array
    const id = "g" + (900000 * 1.6 + Math.floor(Math.random() * 99999 * 1.6)).toString(16); // 6 digit hex
    const player = new Body.Player(0, 10, 120);

    running.push(new Game(id, player, 320, 240).init(io));

    res.json({id, player});
});

// Join game
app.get("/game/:id", (req, res) => {
    const id = req.params.id;
    const index = running.findIndex(game => game.id == id);
    
    if(index != -1) {
        let x = true;
    } else {
        res.json({
            success: false,
            error: "No game running at specified ID."
        })
    }
})

io.on('connection', function (socket) {
    
});