import * as React from 'react';
import getBoard from './board';
import { expect } from 'chai';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import RaisedButton from 'material-ui/RaisedButton';

Enzyme.configure({ adapter: new Adapter() });

test('render board - all states', () => {
  const moveMock = jest.fn();
  const Board = getBoard('codeFoo');
  const board = Enzyme.mount((
    <Board
      G={{pgn: ''}}
      ctx={{numPlayer: 2, turn: 0,  winner: 'd',
          currentPlayer: '0', currentPlayerMoves: 0}}
      moves={{move:  moveMock}}
      playerID="0"
      isActive={true}
      isConnected={true}
    />
  ));
  expect(board.html()).to.contain('Draw!');
  board.setProps({
    ...board.props(),
    ctx: {numPlayer: 2, turn: 0,  winner: 'b',
      currentPlayer: '0', currentPlayerMoves: 0,
    },
  });
  expect(board.html()).to.contain('Black won!');
  board.setProps({
    ...board.props(),
    ctx: {numPlayer: 2, turn: 0,  winner: 'w',
      currentPlayer: '0', currentPlayerMoves: 0,
    },
  });
  expect(board.html()).to.contain('White won!');
  board.setProps({
    ...board.props(),
    ctx: {numPlayer: 2, turn: 0,
      currentPlayer: '0', currentPlayerMoves: 0,
    },
    G: {pgn: '1.f4 e5 2.g4 Qh4#'},
  });
  expect(board.html()).to.contain('CHECK');
});

function rowColAt(row: number, col: number) {
  return 8 * (col - 1) + (8 - row) + 1;
}

test('connection lost', () => {
  const moveMock = jest.fn();
  const Board = getBoard('codeFoo');
  const board = Enzyme.mount((
    <Board
      G={{pgn: ''}}
      ctx={{numPlayer: 2, turn: 0,
          currentPlayer: '0', currentPlayerMoves: 0}}
      moves={{move:  moveMock}}
      playerID="0"
      isActive={true}
      isConnected={false}
    />
  ));
  expect(board.html()).to.contain('Connection lost');
});

test('game sharing', () => {
  const moveMock = jest.fn();
  const Board = getBoard('codeFoo');
  const board = Enzyme.mount((
    <Board
      G={{pgn: ''}}
      ctx={{numPlayer: 2, turn: 0,
          currentPlayer: '0', currentPlayerMoves: 0}}
      moves={{move:  moveMock}}
      playerID="0"
      isActive={true}
      isConnected={true}
    />
  ));
  expect(board.html()).to.contain('Share');
  (board.instance() as any).dismissSharing();
  expect(board.html()).to.not.contain('Share');
});

test('little game', () => {
  const moveMock = jest.fn();
  const Board = getBoard('codeFoo');
  const board = Enzyme.mount((
    <Board
      G={{pgn: ''}}
      ctx={{numPlayer: 2, turn: 0,
          currentPlayer: '0', currentPlayerMoves: 0}}
      moves={{move:  moveMock}}
      playerID="0"
      isActive={true}
      isConnected={true}
    />
  ));
  expect(board.html()).to.contain('White\'s turn');
  // select a2
  board.find('rect').at(rowColAt(2, 1)).simulate('click');
  expect(board.state().selected).to.equal('a2');

  // unselect
  board.find('rect').at(rowColAt(2, 1)).simulate('click');
  expect(board.state().selected).to.equal('');

  // select f2
  board.find('rect').at(rowColAt(2, 6)).simulate('click');
  expect(board.state().selected).to.equal('f2');

  // move to f4
  board.find('rect').at(rowColAt(4, 6)).simulate('click');
  expect(moveMock.mock.calls[0]).to.deep.equal([ 'f4' ]);

  // mock move
  board.setProps({
    ...board.props(),
    ctx: {numPlayer: 2, turn: 1,
      currentPlayer: '1', currentPlayerMoves: 0,
    },
    G: {pgn: '1.f4'},
  });
  expect(board.html()).to.contain('Black\'s turn');

  // try invalid selection
  board.find('rect').at(rowColAt(2, 1)).simulate('click');
  expect(board.state().selected).to.equal('');

  // test inactive
  board.setProps({
    ...board.props(),
    isActive: false,
  });

  // cant select a7
  board.find('rect').at(rowColAt(7, 1)).simulate('click');
  expect(board.state().selected).to.equal('');

  // make it active again
  board.setProps({
    ...board.props(),
    isActive: true,
  });

  // select a7
  board.find('rect').at(rowColAt(7, 1)).simulate('click');
  expect(board.state().selected).to.equal('a7');

  // move to a5
  board.find('rect').at(rowColAt(5, 1)).simulate('click');
  expect(moveMock.mock.calls[1]).to.deep.equal([ 'a5' ]);
});