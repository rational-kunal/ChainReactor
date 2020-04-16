import React, {useState} from "react";
import {useSpring, animated, config} from 'react-spring'
import './Game.css';

export default class GameNode {
    constructor({value, player, coordinate, onTap}) {
        this.props = {
            value: value,
            player: player,
            coordinate: coordinate,
            onTap: onTap
        };

        this.state = {
            animationState: NodeAnimationState(0, null),
            nextAnimationState: NodeAnimationState(0, null)
        }
    }

    valueChanged({value, player, delay}) {
        this.state = {
            animationState: this.state.nextAnimationState,
            nextAnimationState: NodeAnimationState(value, player),
            delay: delay
        };

        this.props.value = value;
    }

    render() {
        return (
            <div className="game-node">

                <Node coordinate={this.props.coordinate}
                      value={this.props.value}
                      player={this.props.player}
                      onTap={this.props.onTap}
                      animationState={this.state.animationState}
                      nextAnimationState={this.state.nextAnimationState}
                      delay={this.state.delay}
                />

            </div>
        )
    }
}

function NodeAnimationState(value, player) {
    const playerColor = ["#3282b8", "#c02739"];
    const size = 60 + value*10;

    return {
        value: value,
        width: size + 'px',
        height: size + 'px',
        lineHeight: size + 'px',
        backgroundColor: player==null ? "#30475e" : playerColor[player]
    }
}

function Node({coordinate, onTap, value, player, animationState, nextAnimationState, delay}) {
    const animation = useSpring({to: nextAnimationState, from: animationState, delay, config: config.wobbly });
    return (
        <animated.div style={animation} className="inner-node" onClick={() => onTap(coordinate)}>
            { value }
        </animated.div>
    )
}