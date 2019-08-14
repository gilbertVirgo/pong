var Body = require('./body');

class Game {
    constructor(id, player, width, height) {
        this.id = id;
        this.players = [];
        this.width = width;
        this.height = height;
        this.bodies = [];
    }

    handleJoin(player, socket) {
        let data = {};

        if(this.players.length < 2) {
            let x = this.players.length == 0 ? 20 : (this.width - 40);
            let y = (this.height / 2) - 50;

            // Add player
            this.bodies.push(new Body.Player(player, x, y));
            this.players.push(player);

            // Success
            data.success = true;
        } else {
            data.success = false;
        } 

        console.log("PLAYERS:", this.players);

        if(this.players.length == 2) this.bodies.push(new Body.Ball(this.width / 2, this.height / 2));

        socket.emit(`join ${data.success ? "success" : "failure"}`);
    }

    handleMove(action, data) {
        let index = this.bodies.findIndex(body => body.id == data.id);

        if(index > -1) {
            switch(action) {
                case "start":
                    // Start moving
                    if(data.dir == "up") this.bodies[index].vel = -1;
                    else if(data.dir == "down") this.bodies[index].vel = 1;
                    break;
                case "stop":
                    // Stop moving
                    this.bodies[index].vel = 0;
                    break;
                default:
                    throw new Error("Invalid action.");
            }
        }
    }

    tick(room) {
        this.bodies.forEach(body => {
            if(body.update)
                body.update(this);
        });
        room.emit("update", this.bodies);
    }

    init(io) {
        var room = io.of(`/${this.id}`);

        console.log("SOCKET ID:", this.id);

        // Sockets
        room.on("connection", socket => {
            socket.on('join', (player) => { this.handleJoin(player, socket) });
            socket.on('start moving', data => { this.handleMove("start", data) });
            socket.on('stop moving', data => { this.handleMove("stop", data) });
        });

        this.bodies.push(new Body.Limit(-10, -10, this.width + 20, 10));
        this.bodies.push(new Body.Limit(-10, this.height, this.width + 20, 10));

        // Game loop
        setInterval(() => {this.tick(room)}, 1000 / 60);

        return this;
    }
}

module.exports = Game;