'use strict'
var gBoard
var gLevel
var gGame
const MINE = '💣'
var board
var size = 4
// var emptyCell = ''

function onInIt() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard(4)
    renderBoard(gBoard)
}



function buildBoard() {
    const board = []
    var mineCount = setMinesNegsCount(i, j, board)
    for (var i = 0; i < size; i++) {
        board.push({})
        for (var j = 0; j < size; j++) {
            board[i][j] = ''
            if (i === 1 && j === 1 || i === 2 && j === 3) board[i][j] = MINE
            if (board[i][j] !== MINE) board[i][j] = setMinesNegsCount(i, j, board)
                
                
            }
        }
        console.log('mineCount:', mineCount);
    console.log('board:', board);
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < size; j++) {

            // console.log('hello');
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}
// function renderBoard(board) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {
//             var cell = board[i][j][0].minesAroundCount
//             if (i === 0 && j === 0 || i === 2 && j === 2) cell = MINE

//             const className = `cell cell-${i}-${j}`
//             // console.log('cell:', cell);
//             strHTML += `<td class="${className}">${cell}</td>`
//         }
//         strHTML += '</tr>'
//     }
//     const elContainer = document.querySelector('.board')
//     console.log('elContainer:', elContainer);
//     elContainer.innerHTML = strHTML
// }

// function renderMines() {

// }

function setMinesNegsCount(cellI, cellJ, mat) {
    // var counter =0
    // console.log('cellI:', cellI);
    // console.log('cellJ:', cellJ);
    // console.log('counter:', counter);
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue

            if (mat[i][j] === MINE) mineCount++
        }
    }
    console.log('mineCount:', mineCount);
    return mineCount
}
// function setMinesNegsCount(cellI, cellJ, mat) {
//     var mineCount = 0
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= mat[i].length) continue
//             if (i === cellI && j === cellJ) continue

//             if (mat[i][j] === MINE) mineCount++
//         }
//     }
//     return mineCount
// }