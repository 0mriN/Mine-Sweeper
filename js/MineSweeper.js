'use strict'
var gBoard
var gGame
const MINE = '💣'
const FLAG = '🚩'
const LIVE = '🖤'
const WINSMILEY = '😎'
const LOSESMILEY = '🤯'
var gBoard
var gSize = 4
var gMinesNum = 2
var gStartTime
var gTimerInterval
var gTimeOn = false
var countLives = 3
var isFirstClick = true
var elRestartIcon = document.querySelector('.restart')
var gHighScore = 0


function onInIt() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard(4)
    resetTimer()
    countLives = 3
    updateLivesDisplay()
    isFirstClick = true
    elRestartIcon.innerHTML = '😃'
    modal()

}

function buildBoard() {
    const board = []
    for (var i = 0; i <= gSize - 1; i++) {
        board.push([])
        for (var j = 0; j < gSize; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
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

function setMinesNegsCount(cellI, cellJ, mat) {
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
        if (isFirstClick === true) {
            setMines(gMinesNum, gBoard, cellI, cellJ)
            isFirstClick = false
        }
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
    const cell1 = gBoard[cellI][cellJ];
    const cell = document.querySelector(`.cell-${cellI}-${cellJ}`)
    const isMine = cell1.isMine
    cell1.isShown = true
    cell.classList.add('clicked');

    if (isMine === true) {
        cell.innerText = MINE
        countLives--
        checkLose()
        updateLivesDisplay()
        if (gMinesNum === 2) finishGame()
    } else {
        cell1.minesAroundCount = setMinesNegsCount(cellI, cellJ, gBoard)
        const value = cell1.minesAroundCount
        cell.innerText = value;
    } if (cell1.minesAroundCount === 0) {
        cell.innerText = ''
        expandShown(gBoard, cellI, cellJ)
    }

}

function finishGame(isVictory) {
    if (isVictory === true) {
        document.querySelector('.modal h3').style.display = 'none'
        document.querySelector('.modal h2').style.display = 'block'
        elRestartIcon.innerHTML = WINSMILEY
        document.querySelector('.modal').style.color = 'rgb(11, 206, 212)'
       updateHighScore(gGame.shownCount)
    } else {
        document.querySelector('.modal h2').style.display = 'none'
        document.querySelector('.modal h3').style.display = 'block'
        document.querySelector('.modal').style.color = 'red'
        revealMines()
        elRestartIcon.innerHTML = LOSESMILEY
    }
    gGame.isOn = false
    modal()
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

function setMines(num, board, isFirstClickI, isFirstClickJ) {
    var minesPlaced = 0
    while (minesPlaced < num) {
        var randI = Math.floor(Math.random() * gSize);
        var randJ = Math.floor(Math.random() * gSize);
        if (board[randI][randJ].isMine === false && (randI !== isFirstClickI || randJ !== isFirstClickJ)) {
            board[randI][randJ].isMine = true;
            minesPlaced++
        }

    }
}

function chooseDifficultyLevel(num) {
    if (num === 4){
     gMinesNum = 2
     
    }    
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

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                const cell = document.querySelector(`.cell-${i}-${j}`)
                cell.innerText = MINE
            }
        }
    }
}

function checkLose() {
    if (countLives === 0) {
        finishGame()
    }
}

function expandShown(board, cellI, cellJ) {
    if (cellI < 0 || cellI >= gSize || cellJ < 0 || cellJ >= gSize) return
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i >= gSize || j < 0 || j >= gSize) continue;
            if (board[i][j].isShown || board[i][j].isMarked || board[i][j].isMine) continue
            revealCell(i, j);
            if (board[i][j].minesAroundCount === 0) {
                revealCell(board, i, j);
            }
        }
    }
}

function updateLivesDisplay() {
    var elHeartIcon = document.querySelector('.lives');
    if (gMinesNum === 2) countLives = 0
    elHeartIcon.innerHTML = '';
    for (var i = 0; i < countLives; i++) {
        elHeartIcon.innerHTML += LIVE;
    }
}

function modal() {
    var elModal = document.querySelector('.modal')
    if (gGame.isOn === true) elModal.style.display = 'none'
    else elModal.style.display = 'block'
}

function getHighScore() {
    const storedScore = localStorage.getItem('highScore');
    if (storedScore !== null) {
        gHighScore = parseInt(storedScore);
    }
}

function updateHighScore(time){
    if(time<gHighScore||gHighScore===0){
        gHighScore = time;
        localStorage.setItem('highScore', gHighScore);
        document.querySelector('.highScore').innerText = gHighScore.toFixed(2);
    }
}

