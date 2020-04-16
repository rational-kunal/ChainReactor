class PlayerPoolController {
    constructor(playerSize, wonFn) {
        this.playerSize = playerSize;
        this.currentPlayer = 0;

        this.wonFn = wonFn;

        this.wait = false;

        this.defeatedPool = Array(this.playerSize).fill(false);
        this.playerNRegion = Array(this.playerSize).fill(0);

        this.moves = 0;
    }

    moveComplete() {
        this.moves++;

        this.currentPlayer++;
        this.currentPlayer %= this.playerSize;
        while (this.defeatedPool[this.currentPlayer]) {
            this.currentPlayer++;
            this.currentPlayer %= this.playerSize;
        }
    }

    isComplete() {
        let stillInGame = 0;
        if (this.moves > this.playerSize && !this.wait) {
            this.playerNRegion.forEach((n, i) => n > 0 || stillInGame++);

            if (stillInGame === 1) {
                this.playerNRegion.forEach((n, i) => n > 0 || this.wonFn(i));
                return true;
            }

            return false;
        }

        return false;
    }
}

export default class ChainReactor {
    grid = [];

    constructor(gridSize, playerSize, wonFn) {
        this.gridSize = gridSize;

        this.playerController = new PlayerPoolController(playerSize, wonFn);

        for (let row = 0; row < this.gridSize.row; row++) {
            this.grid.push([]);
            for (let col = 0; col < this.gridSize.column; col++) {
                this.grid[row].push({
                    value: 0,
                    player: null,
                });
            }
        }
    }

    printGrid() {
        for (let row = 0; row < this.gridSize.row; row++) {
            console.log(this.grid[row]);
        }
    }

    canAddAt(x, y) {
        return (
            this.grid[x][y].player == null ||
            this.grid[x][y].player === this.playerController.currentPlayer
        );
    }

    canExplode(x, y) {
        const value = this.grid[x][y].value;
        if (
            (x === 0 && y === 0) ||
            (x === 0 && y === this.gridSize.column - 1) ||
            (x === this.gridSize.row - 1 && y === 0) ||
            (x === this.gridSize.row - 1 && y === this.gridSize.column - 1)
        ) {
            return value === 1;
        }

        if (
            x === 0 ||
            x === this.gridSize.row - 1 ||
            y === 0 ||
            y === this.gridSize.column - 1
        ) {
            return value === 2;
        }

        return value === 3;
    }

    explosionIn(x, y) {
        let explode_at = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
        ];
        return explode_at.filter(({ x, y }) => {
            return (
                x >= 0 &&
                x < this.gridSize.row &&
                y >= 0 &&
                y < this.gridSize.column
            );
        });
    }

    reactionAt(x, y, fn) {
        let reaction = {
            change: {
                value: 0,
                player: null,
            },
            explodeTo: [],
        };

        if (this.canExplode(x, y)) {
            reaction.explodeTo = this.explosionIn(x, y);
            this.grid[x][y].value = 0;
            this.playerController.playerNRegion[this.grid[x][y].player]--;
            this.playerController.wait = true;
            this.grid[x][y].player = null;
        } else {
            this.grid[x][y].value++;

            this.playerController.playerNRegion[this.grid[x][y].player]--;
            this.playerController.wait = false;
            this.grid[x][y].player = this.playerController.currentPlayer;
            reaction.change.player = this.playerController.currentPlayer;
            this.playerController.playerNRegion[this.grid[x][y].player]++;
        }

        reaction.change.value = this.grid[x][y].value;

        fn(reaction);
    }

    didMove(x, y) {
        if (!this.canAddAt(x, y)) {
            return null;
        }

        let addTo = [{ x: x, y: y }];
        let reactionChain = [];

        while (addTo.length !== 0 && !this.playerController.isComplete()) {
            let newAddTo = [];
            let newChain = {
                valueChangeAt: [],
                explosions: [],
            };

            addTo.forEach(({ x, y }, index) => {
                if (this.playerController.isComplete()) return;
                this.reactionAt(x, y, ({ change, explodeTo }) => {
                    newChain.valueChangeAt.push({
                        x: x,
                        y: y,
                        value: change.value,
                        player: change.player,
                    });

                    explodeTo.forEach((coordinate) => {
                        newChain.explosions.push({
                            ux: x,
                            uy: y,
                            vx: coordinate.x,
                            vy: coordinate.y,
                        });

                        newAddTo.push(coordinate);
                    });
                });
            });

            reactionChain.push(newChain);
            addTo = newAddTo;
        }

        this.playerController.moveComplete();

        return reactionChain;
    }
}
