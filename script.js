const gameBoard = (function () {
    const board = [
        ["empty", "empty", "empty"],
        ["empty", "empty", "empty"],
        ["empty", "empty", "empty"]
    ]
    function isAvailble(row,column){
        return board[row][column]==="empty";
    }
    function addToken(row, column, token) {
       
        if (isAvailble(row,column)) {
            board[row][column] = token;
        }  
    }
    function checkWin() {
        let win = false;
        console.log(board);
        if (board[1][1] !== "empty") {
            if (board[0][0] === board[1][1] && board[2][2] === board[0][0]) return true;
            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 1; j < 3; j++) {
                if (board[i][j] === "empty") {
                    win = false;
                    break;
                } else if (board[i][j] === board[i][j - 1]) {
                    win = true;
                }
                else {
                    win = false;
                    break;
                }
            }
            //row win
            if (win === true) return win;
            let counter = 0;
            for (let j = 0; j < 2; j++) {
                if (board[j][i] === "empty") {
                    win = false;
                    break;
                }
                else if (board[j][i] === board[j + 1][i]) {
                    win = true;
                    counter++;
                }
                else {
                    win = false;
                    break;
                }

            }
            if (counter == 2) return true;
            //column check
        }
        return win;
    }
    function checkDraw() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                console.log(board[i][j]);
                if (board[i][j] === "empty") return false;
            }
        }
        return true;
    }
    function reset() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "empty";
            }
        }
    }
    function getToken(row, column) { return board[row][column] };
    return {
        addToken,
        checkDraw,
        checkWin,
        reset,
        getToken,
        isAvailble
    }
})();

function Player(name, marker) {
    this.name = name;
    this.marker = marker;
    this.score = 0;
}
let player1;
let player2 ;


const Dom = (() => {
    const cells = document.querySelectorAll(".cell");
    function settingDataRowColumnToDomCell() {
        const cells = document.querySelectorAll(".cell");
        let row = 0;
        for (let i = 0; i < 9;) {
            for (let column = 0; column < 3; column++) {
                cells[i].setAttribute("data-row", row)
                cells[i++].setAttribute("data-column", column)
            }
            row++;
        }

    }
    settingDataRowColumnToDomCell();

    function addEvents() {
        for (let i = 0; i < 9; i++) {
            cells[i].addEventListener("click", (e) => game.round(e));
        }
    }
    addEvents();

    function winAdd(ActivePlayer) {
        const span = document.querySelector(`#${ActivePlayer.marker}-score>span`);
        span.textContent = ActivePlayer.score;
    }
    function reset() {
        const cellsArray = Array.from(cells);
        cellsArray.map((cell) => cell.textContent = "");
    }
  const newGame=(()=>{
        const button = document.querySelector("#start");
        const form=document.querySelector("form");
        
        button.addEventListener("click", (e) => form.style.display="block");
        form.addEventListener("submit",(e)=>{
            e.preventDefault();  
            player1= new Player(document.querySelector("#playerX").value,"x");
            player2=new Player(document.querySelector("#playerO").value,"o");
            document.querySelector("#playerx").textContent=player1.name;
            document.querySelector("#playero").textContent=player2.name;
            document.querySelector("#x-score>span").textContent=player1.score;
            document.querySelector("#o-score>span").textContent=player2.score;
            form.style.display="none";
        })
    })();

const restart=(()=>{
    function findWinner(){
        if(player1.score>player2.score){
            return player1.name+"win";
        }else if(player2.score>player1.score){
            return player2.name+"win";
        }else return "it's a tie";
    }

    document.querySelector("#restart").addEventListener("click",()=>{
        alert(findWinner());
        player1.score=0;
        player2.score=0;
        document.querySelector("#x-score>span").textContent=player1.score;
        document.querySelector("#o-score>span").textContent=player2.score;
        Dom.reset();
        gameBoard.reset();
    })
})();
    return {
        winAdd,
        reset
    }
})();



const game = (() => {
    let ActivePlayer;
    function round(e) {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        if(gameBoard.isAvailble(row,column)===false)return;
        ActivePlayer = ActivePlayer === player1 ? player2 : player1;
        gameBoard.addToken(row, column, ActivePlayer.marker)
        console.log()
        e.target.textContent = gameBoard.getToken(row, column);
        if (gameBoard.checkWin()) {

            ActivePlayer.score++;
            Dom.winAdd(ActivePlayer);
            console.log("filevan jayiche");
            console.log(ActivePlayer.score);
            setTimeout(()=>{
                gameBoard.reset();
                Dom.reset();
            },1000);
          

        }
        if (gameBoard.checkDraw()) {
            console.log("draw ayi");
        }

    }

    return { round };
}
)();