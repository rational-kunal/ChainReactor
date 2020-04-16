import React from "react";
import GameNode from "./GameNode";
import './Game.css';

import ChainReactor from "../core/ChainReactor";

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.nodeGrid = [];
        this.wait = false;
        this.gridSize = props.gridSize;
        this.state = {
            won: false
        };

        this.gameController = new ChainReactor({row: this.gridSize.rowCount,column: this.gridSize.columnCount}, props.playerCount, (player) => {
            this.setState({
                won: player+1
            })
        });

        this.nodeTapped = this.nodeTapped.bind(this);
    }

    nodeTapped({row, column}) {
        if (this.wait) { return }

        const reactionChain = this.gameController.didMove(row, column);

        if (reactionChain==null) { return }

        let delay = 0;
        let delayDelta = 300;
        reactionChain.forEach((reaction) => {
            reaction.valueChangeAt.forEach(({x, y, value, player}) => {
                this.nodeGrid[x][y].valueChanged({value, player, delay});
            });
            delay += delayDelta;
            delayDelta /= 5;
        });

        this.wait = true;
        setTimeout(()=>{
            this.wait = false;
            this.forceUpdate();
        }, delay-delayDelta);

        this.forceUpdate();
    }

    componentDidMount() {
        for (let row = 0; row < this.gridSize.rowCount; row++) {
            this.nodeGrid.push([]);
            for (let column = 0; column < this.gridSize.columnCount; column++) {
                this.nodeGrid[row].push(
                    new GameNode({value: 0, player:null,
                        coordinate:{row:row, column:column},
                        onTap:this.nodeTapped})
                );
            }
        }

        this.forceUpdate();
    }

    render() {
        return (
            <div style={{width: this.gridSize.columnCount * 100 + 'px', display: 'flex', flexWrap: 'wrap'}} className="board" >
                <div style={{width: this.gridSize.columnCount * 100 + 'px' }} className="helper">
                    { this.state.won ?  this.state.won + "has won"
                     : ((!this.wait || "wait for animation, ") +
                     (this.gameController.playerController.currentPlayer+1) + "'s turn") }
                </div>
                { this.nodeGrid.flat(2).map((node) => node.render()) }
            </div>
        )
    }
}