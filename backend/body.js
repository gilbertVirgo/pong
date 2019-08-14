exports.Player = function(id, x, y) {
    this.id = id;
    this.shape = "rect";
    this.width = 20;
    this.height = 100;
    this.pos = {
        x: x,
        y: y
    };
    this.vel = 0;

    this.update = (game) => {
        if(((this.pos.y + this.vel) > 0) && ((this.pos.y + this.height + this.vel) < game.height))
            this.pos.y += this.vel;
    }
}

exports.Ball = function(x, y) {
    this.shape = "circle";
    this.radius = 10;
    this.pos = {
        x: x,
        y: y
    };
    this.vel = {
        x: -1,
        y: 0
    };

    this.intersects = function(player) {
        if(
            ((this.pos.x + this.radius) >= player.pos.x) &&
            ((this.pos.y + this.radius) >= player.pos.y) &&
            ((this.pos.x - this.radius) <= (player.pos.x + player.width)) &&
            ((this.pos.y - this.radius) <= (player.pos.y + player.height))
        ) {
            return true;
        } else return false;
    }

    this.update = function(game) {
        ["x", "y"].forEach(axis => {this.pos[axis] += this.vel[axis]});

        game.bodies.forEach(body => {
            if(body != this)
                if(this.intersects(body))
                    this.vel.x *= -1;
        });
    }
}

exports.Limit = function(x, y, width, height) {
    this.shape = "rect";
    this.pos = {
        x: x,
        y: y
    };
    this.width = width;
    this.height = height;
}