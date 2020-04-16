import React from "react";
import GameNode from "./GameNode";
import './Game.css';

import ChainReactor from "../core/ChainReactor";

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.nodeGrid = [];
        this.gridSize = props.gridSize;

        this.gameController = new ChainReactor({row: this.gridSize.rowCount,column: this.gridSize.columnCount}, props.playerCount);

        this.nodeTapped = this.nodeTapped.bind(this);
    }

    nodeTapped({row, column}) {
        const reactionChain = this.gameController.didMove(row, column);

        if (reactionChain==null) { return }

        let delay = 0;
        let delayDelta = 300;
        reactionChain.forEach((reaction) => {
            reaction.valueChangeAt.forEach(({x, y, value, player}) => {
                this.nodeGrid[x][y].valueChanged({value, player, delay});
            });
            delay += delayDelta;
            delayDelta /= 3;
        });

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
                { this.nodeGrid.flat(2).map((node) => node.render()) }
            </div>
        )
    }
}