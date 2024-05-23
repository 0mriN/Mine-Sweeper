'use strict'
var gBoard
var gGame
const MINE = '💣'
const FLAG = '🚩'
var gBoard
var gSize = 4
var gMinesNum = 2
var gStartTime
var gTimerInterval
var gTimeOn = false
var countLives = 3


function onInIt() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0 // use this instead of what u used
    }
    gBoard = buildBoard(4)
    resetTimer()
}

function buildBoard() {
    const board = []
    for (var i = 0; i <= gSize - 1; i++) {
        board.push([])
        for (var j = 0; j < gSize; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }
    setMines(gMinesNum, board)
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            if (board[i][j].isMine === false) {
                board[i][j].minesAroundCount = setMinesNegsCount(i, j, board);
            }
        }
    }
    renderBoard(board)
    console.log('board:', board);
    console.table(board);
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < gSize; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gSize; j++) {
            var cell = ''
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}"onclick="onCellClicked(this,event)" 
                           oncontextmenu="onCellClicked(this,event) ">
                           ${cell}
                        </td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ, mat) { // 0,0
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (mat[i][j].isMine === true) negsCount++
        }
    }
    return negsCount
}

function onCellClicked(clickedCell, event) {
    event.preventDefault()

    const classList = clickedCell.classList[1].split('-');
    const cellI = parseInt(classList[1]);
    const cellJ = parseInt(classList[2]);

    if (event.button === 0) {
        if (clickedCell.classList.contains('clicked') || clickedCell.classList.contains('marked')) return
        if (gGame.isOn === false) return
        if (!gBoard[cellI][cellJ].isMine) {
            gGame.shownCount++
            if (gTimeOn === false) startTimer()
        }

        revealCell(cellI, cellJ)

    } else if (event.button === 2) {

        if (!clickedCell.classList.contains('clicked')) {
            clickedCell.classList.toggle('marked')
            if (clickedCell.classList.contains('marked')) {
                gBoard[cellI][cellJ].isMarked = true
                clickedCell.innerText = FLAG
                gGame.markedCount++
            } else {
                gBoard[cellI][cellJ].isMarked = false
                clickedCell.innerText = ''
                gGame.markedCount--
            }
        }
    }
    if (checkVictory() === true) finishGame(true)

}

function revealCell(cellI, cellJ) {
    const cell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    const isMine = gBoard[cellI][cellJ].isMine
    gBoard[cellI][cellJ].isShown = true
    cell.classList.add('clicked');
    if (isMine === true) {
        cell.innerText = MINE
        countLives--
        if (countLives === 0) {
            finishGame();
        } if (gMinesNum === 2) finishGame()
    } else {
        const value = gBoard[cellI][cellJ].minesAroundCount
        cell.innerText = value;
    }


}

function finishGame(isVictory) {
    if (isVictory === true) {
        alert('you won!')
    } else {
        alert('game over!')
    }
    gGame.isOn = false
    clearInterval(gTimerInterval)

}
function checkVictory() {
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) {
                return false
            }
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) {
                return false
            }
        }
    }
    return true
}

function setMines(num, board) {
    var minesPlaced = 0
    while (minesPlaced < num) {
        var randI = Math.floor(Math.random() * gSize);
        var randJ = Math.floor(Math.random() * gSize);
        if (board[randI][randJ].isMine === false) {
            board[randI][randJ].isMine = true;
            minesPlaced++
        }

    }
}

function chooseDifficultyLevel(num) {
    if (num === 4) gMinesNum = 2
    if (num === 8) gMinesNum = 14
    if (num === 12) gMinesNum = 32
    gSize = num
    onInIt()

}

function startTimer() {

    gStartTime = Date.now()
    gTimeOn = true

    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2);
        var elSpan = document.querySelector('.time');
        elSpan.innerText = seconds
    }, 10);
}

function resetTimer() {
    clearInterval(gTimerInterval)
    gTimeOn = false
    var elSpan = document.querySelector('.time')
    elSpan.innerText = '0.00'
}

