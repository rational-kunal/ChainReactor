import React from "react";
import ChainReactor from "../core/ChainReactor";

const playerColor = ["red", "blue"];

class GameNode extends React.Component {
    constructor({value, player, coordinate}) {
        super(null);
        this.coordinate = coordinate;
        this.state = {
            value: value,
            ofPlayer: player
        };

        console.log("v", this.state.value);
    }

    gameNodeCSS() {
        return {
            width: "50px",
            height: "50px",

            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: "25px",

            backgroundColor: (this.props.player!=null ? playerColor[this.props.player] : "wheat"),
        }
    }

    render() {
        return (
            <div style={this.gameNodeCSS()} onClick={() => this.props.onTap(this.coordinate)}>
                { this.props.value }
            </div>
        )
    }
}

export default class Game extends React.Component {
    constructor({gridSize, playerCount}) {
        super(null);

        this.gameNodeGrid = [];
        this.gridSize = gridSize;
        this.playerCount = playerCount;

        this.gameController = new ChainReactor({row: this.gridSize.rowCount, column: this.gridSize.columnCount}, this.playerCount);

        this.nodeTapped = this.nodeTapped.bind(this);
    }

    nodeTapped({row, column}) {
        const reactionChain = this.gameController.didMove(row, column);

        if (reactionChain==null) { return }

        reactionChain.forEach((reaction) => {
            reaction.valueChangeAt.forEach(({x, y, value, player}) => {
                this.gameNodeGrid[x][y] = (<GameNode value={value} player={player} coordinate={{row: x, column: y}}
                                                    onTap={this.nodeTapped}/>);
                console.log(this.gameNodeGrid[x][y].props);
            });
        });

        this.forceUpdate();
    }

    componentDidMount() {
        for (let row = 0; row < this.gridSize.rowCount; row++) {
            this.gameNodeGrid.push([]);
            for (let column = 0; column < this.gridSize.columnCount; column++) {
                this.gameNodeGrid[row].push(<GameNode value={0} player={null} coordinate={{row: row, column: column}}
                                                      onTap={this.nodeTapped}/>);
            }
        }

        this.forceUpdate();
    }

    render() {
        return (
            <div style={{width: this.gridSize.columnCount * 50 + 'px', display: 'flex', flexWrap: 'wrap'}}>
                {this.gameNodeGrid.flat(2)}
            </div>
        )
    }
}