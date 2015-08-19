var board = new Array();
var score = 0;//分数
var currentPosition = 0;//当前职位
var hasConflicted = new Array();//冲突事件
var isGameOverFlag = false;//是否结束
var isMoving = false;//关闭操作
var canScroll = true;//禁用滚屏

$(document).ready(function(){
	prepareForMobile();
	newgame();
}); 

function prepareForMobile(){
	if( documentWith > 400){
		//documentWith = 400;
		gridContainerWidth = 316;
		cellSpace = 12;
		cellSideLength = 64;
	}
	$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02*gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', 0.02*cellSideLength);
}
function newgame(){
	isGameOverFlag = false;
	currentPosition = 0;
	score = 0;
	init();
	generateOneNumber();
	generateOneNumber();
}

function init(){
	updateScore(score, 2)
	for(var i=0; i<4; i++){
		for (var j= 0; j < 4; j++) {
			var gridCell = $('#grid-cell-'+i+"-"+j);
			gridCell.css('top',getPosTop(i, j));
			gridCell.css('left',getPosLeft(i, j));
		}
	}
	for(var i=0; i<4; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j=0; j<4; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	updateBoardView();

	
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			if(board[i][j] == 0){
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j)+cellSideLength/2);
				theNumberCell.css('left', getPosLeft(i, j)+cellSideLength/2);
			}else{
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(getTextValue(board[i][j]));
			}
			hasConflicted[i][j] = false;
		}
	}
	$('.number-cell').css('line-height', cellSideLength+'px');
	$('.number-cell').css('font-size', 0.2 * cellSideLength+'px');
	// $('.number-cell').css('text-shadow', 'none');
}
function generateOneNumber(){
	//判断是否可以继续进行
	if(nospace(board)){
		return false;

	}
	//随机位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));

	var times = 0;
	while(times < 50){
		if(board[randx][randy] == 0){
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		times++;
	}
	if(times == 50){
		for(var i=0; i<4; i++){
			for(var j=0; j<4; j++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;

				}
			}
		}
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	//显示随机数字
	board[randx][randy] = randNumber;
	updateScore(score, randNumber);
	//动画
	showNumberWithAnimation(randx, randy, randNumber);
	//开启操作
	isMoving = false;
	return true;

}

$(document).keydown(function(event){
	if(!canScroll){
		switch(event.keyCode){
			case 37:
		event.preventDefault();//remove按键默认效果
		if(!isGameOverFlag){
			if(!isMoving){
				if(moveLeft()){
					isMoving = true;
					setTimeout("generateOneNumber()", 210);
					setTimeout("isGameOver()", 300);
				}
			}
			
		}else{
			gameOver();
		}
		
		break;
		case 38:
		event.preventDefault();//remove按键默认效果
		if(!isGameOverFlag){
			if(!isMoving){
				if(moveUp()){
					isMoving = true;//关闭操作
					setTimeout("generateOneNumber()", 210);
					setTimeout("isGameOver()", 300);
				}
			}
		}else{
			gameOver();
		}
		break;
		case 39:
		event.preventDefault();//remove按键默认效果
		if(!isGameOverFlag){
			if(!isMoving){
				if(moveRight()){
					isMoving = true;
					setTimeout("generateOneNumber()", 210);
					setTimeout("isGameOver()", 300);
				}
			}
		}else{
			gameOver();
		}
		break;
		case 40:
		event.preventDefault();//remove按键默认效果
		if(!isGameOverFlag){
			if(!isMoving){
				if(moveDown()){
					isMoving = true;
					setTimeout("generateOneNumber()", 210);
					setTimeout("isGameOver()", 300);
				}
			}
		}else{
			gameOver();
		}
		break;
		default:
		break;
	}
}

})

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
	if(!canScroll){
		event.preventDefault();//remove按键默认效果
	}
});


document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;
	var moveLength = 0.05*documentWith;
	if(moveLength > 30){ 
		moveLength = 30;
	}
	if(Math.abs(deltax)<moveLength && Math.abs(deltay)<moveLength){
		return;
	}
	if(!canScroll){
		if(Math.abs(deltax) >= Math.abs(deltay)){
			if(deltax > 0){
				if(!isGameOverFlag){
					if(!isMoving){
						if(moveRight()){
							isMoving = true;
							setTimeout("generateOneNumber()", 210);
							setTimeout("isGameOver()", 550);
						}
					}
				}else{
					gameOver();
				}
			}else{
				if(!isGameOverFlag){
					if(!isMoving){
						if(moveLeft()){
							isMoving = true;
							setTimeout("generateOneNumber()", 210);
							setTimeout("isGameOver()", 550);
						}
					}
				}else{
					gameOver();
				}
			}
		}else{
			if(deltay > 0){
				if(!isGameOverFlag){
					if(!isMoving){
						if(moveDown()){
							isMoving = true;
							setTimeout("generateOneNumber()", 210);
							setTimeout("isGameOver()", 550);
						}
					}
				}else{
					gameOver();
				}
			}else{
				if(!isGameOverFlag){
					if(!isMoving){
						if(moveUp()){
							isMoving = true;
							setTimeout("generateOneNumber()", 210);
							setTimeout("isGameOver()", 550);
						}
					}
				}else{
					gameOver();
				}
			}
		}
	}
	
});


function isGameOver(){
	if(nospace(board) && noMove(board)){
		gameOver();
	}

}
function gameOver(){
	isGameOverFlag = true;
	alert("老板说不给你涨了！\n换个公司重新来过吧！");
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for(var i=0; i<4; i++){
		for(var j=1; j<4; j++){
			if(board[i][j] != 0){
				for(var k=0; k<j; k++){
					if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board)&& !hasConflicted[i][k]){
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updateScore(score, board[i][k]);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for(var i=0; i<4; i++){
		for(var j=2; j>=0; j--){
			if(board[i][j] != 0){
				for(var k=3; k>j; k--){
					if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
						showMoveAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updateScore(score, board[i][k]);
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=1; i<4; i++){
			if(board[i][j] != 0){
				for(var k=0; k<i; k++){
					if(board[k][j] == 0 && noBlockVertical(k,i,j,board)){
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j] && noBlockVertical(k,i,j,board)&& !hasConflicted[k][j]){
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score+=board[k][j];
						updateScore(score, board[k][j]);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=2; i>=0; i--){
			if(board[i][j] != 0){
				for(var k=3; k>i; k--){
					if(board[k][j] == 0 && noBlockVertical(i,k,j,board)){
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j] == board[i][j] && noBlockVertical(i,k,j,board)&& !hasConflicted[k][j]){
						showMoveAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score+=board[k][j];
						updateScore(score, board[k][j]);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}