'use strict'
var gBoard
var gLevel
var gGame
const MINE = '💣'
var board
var size = 4
var block = '⬛'
var minesAroundCount


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
    minesAroundCount = countNegs(i, j, board)
    for (var i = 0; i <= size - 1; i++) {
        board.push({})
        for (var j = 0; j < size; j++) {
            board[i][j] = ''
            if (i === 1 && j === 1 || i === 2 && j === 3) board[i][j] = MINE

            // if (board[i][j] !== MINE) board[i][j] = countNegs(i, j, board)

        }
    }
    // console.log('mineCount:', mineCount);
    console.log('board:', board);
    console.table(board);
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
            console.log('className:', className);

            strHTML += `<td class="${className}" onclick="onCellClicked(this)">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}


function countNegs(cellI, cellJ, mat) { // 0,0
    var negsCount = 0
    console.log('cellI:', cellI, 'cellJ:', cellJ);
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            console.log('i:', i, 'j:', j);
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue

            if (mat[i][j] === MINE) negsCount++
        }
    }
    console.log('negsCount:', negsCount);
    return negsCount
}

function onCellClicked(location) {
    console.dir(location);
    console.log(location.className);
}