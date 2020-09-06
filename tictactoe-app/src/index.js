import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
    return (
        <button className={"square" + (props.winBackground ? ' winBG' : '')}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winBackground={this.props.winBG && this.props.winBG.includes(i)}
        />;
    }

    render() {
        let squares = [];
        for (let i = 0; i < 3; i++) {
            let rows = [];
            for (let j = 0; j < 3; j++) {
                rows.push(this.renderSquare(i * 3 + j));
            }
            squares.push(
                <div key={i} className="board-row">{rows}</div>
            )
        }
        return (
            <div>{squares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNum: 0,
            sortAscending: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                lastPositionSquare: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNum: history.length
        })
    }
    jumpTo(step) {
        this.setState({
            stepNum: step,
            xIsNext: (step % 2) === 0
        })
    }
    handleSort() {
        this.setState({
            sortAscending: !this.state.sortAscending
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const winnerStat = calculateWinner(current.squares);
        const winner = winnerStat.winner;
        let moves = history.map((step, move) => {
            const row = 1 + Math.floor(step.lastPositionSquare / 3);
            const column = 1 + step.lastPositionSquare % 3;
            const desc = move ?
                `Go to move #${move} (${row}, ${column})` :
                'Restart game';
            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNum ? 'boldMove' : ''}
                        onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        if (!this.state.sortAscending) {
            moves.reverse();
        }
        let status;
        console.log(this.state.stepNum);
        if (winner) {
            status = winner + ' wins!';
        } else if (this.state.stepNum === 9 && !winner) {
            status = "It's a draw!";
        }
        else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winBG={winnerStat.winBG}
                    />
                </div>
                <div className="game-info">
                <div>{status}</div><br/>
                Game History: <br/><br/>
                    <button className="btnHist"
                        onClick={() => this.handleSort()}>
                        Sort: <b>{this.state.sortAscending ? 'Descending' : 'Ascending'}</b>
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winBG: lines[i],
                draw: false
            }
        }
    }
    return {
        winner: null,
        winBG: null
    }
}
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);