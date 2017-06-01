const northImg=new Image();
northImg.src="image/north.png";//上
const southImg=new Image();
southImg.src="image/south.png";//下
const eastImg=new Image();
eastImg.src="image/east.png";//右
const westImg=new Image();
westImg.src="image/west.png";//左
const bodyImg=new Image();
bodyImg.src="image/body.png";//体
const foodImg=new Image();
foodImg.src="image/food.png";//食
const startImg=new Image();
startImg.src="image/start.png";//将欢迎页面放在最后
const bgImg=new Image();
bgImg.src="image/background.png";//开始页面

function Snake(){
	this.canvas=$("#gameview")[0]//canvas画布对象；
	this.ctx=this.canvas.getContext("2d");//画笔
	this.width=500;//背景(游戏屏幕)宽度
	this.height=500;//背景高度
	this.step=25;//设计步长
	this.stepX=Math.floor(this.width/this.step);//X轴的步数
	this.stepY=Math.floor(this.height/this.step);//Y轴的步数
	this.snakeBodyList=[];//蛇身数组
	this.foodList=[];//食物数组
	this.isDead=false;//蛇是否活着标示位
    this.isEaten=false;//蛇是否碰到自身
    this.score = 0;//分数  +10  存入到localStorage中
    this.isPhone=false;
	/*
	 1.生成初始化页面点击页面进入游戏
	 * */
//	this.init=function(){
//		this.device();
//		this.ctx.drawImage(startImg,0,0,500,500);
//	}
	/*
	 2.游戏开始，绘制背景、蛇、食物
	 * */
	this.open=function(){
		this.device();
		this.start();
		//2.4蛇移动
		this.score=0;//积分清零
		
		this.move();
	}
	this.start=function(){
		
		//2.1画出背景
		this.ctx.drawImage(bgImg,0,0,this.width,this.height);
		//2.2画蛇
		this.drawSnake();
		//2.3画食物
		this.drawFood();
		
	}
	/* 
	 *判断当前设备是否为移动端*/
	this.device=function(){
		var deviceInfo=navigator.userAgent;
		if(deviceInfo.indexOf("Windows")==-1){
			this.isPhone=true;
			this.canvas.width=window.innerWidth;
			this.canvas.height=window.innerHeight;
			this.width=window.innerWidth;
			this.height=window.innerHeight;
			this.stepX=this.width/this.step;
			this.stepY=this.height/this.step;
			console.log(this.width+":"+this.height);
			console.log(this.canvas.height);
		}
	}
	/*
	 3.蛇的移动
	 3.1判断设备是pc还是移动
	 3.2生成键盘事件 和 触屏事件
	 * */
	this.keyHandler=function(){//键盘事件
		var _this = this;
		document.onkeydown = function(ev){
			var ev = ev||window.event;
//			console.log(_this.snakeBodyList);
			switch(ev.keyCode){
				case 37://向左
					_this.snakeBodyList[0].img = westImg;
					_this.snakeBodyList[0].direct = 'west';
				break;
				case 38://向上
					_this.snakeBodyList[0].img = northImg;
					_this.snakeBodyList[0].direct = 'north';
				break;
				case 39://向右
					_this.snakeBodyList[0].img = eastImg;
					_this.snakeBodyList[0].direct = 'east';
				break;
				case 40://向下
					_this.snakeBodyList[0].img = southImg;
					_this.snakeBodyList[0].direct = 'south';
				break;
			}
		}
	};
	this.touchHandler=function(event){//触屏事件
	var _this=this;
	document.addEventListener("touchstart",function(ev){
//		ev.preventDefault();
//		console.log(ev);
var touchX=ev.changedTouches[0].clientX;
var touchY=ev.changedTouches[0].clientY;
var head=_this.snakeBodyList[0];
var headX=head.x*_this.step;
var headY=head.y*_this.step;
if(head.direct=="north"||head.direct=="south"){
	if(touchX<headX){
		head.direct="west";
		head.img=westImg;
	}else{
		head.direct="east";
		head.img=eastImg;
	}
}else if(head.direct == "west" || head.direct == "east"){
	if(touchY < headY){
					head.direct = "north";
					head.img = northImg;
				}else{
					head.direct = "south";
					head.img = southImg;
				}
			
}

	})
	};
this.move=function(){
//事件处理是异步的，所以，无法传递this对象
if(!this.isPhone){
	this.keyHandler();
}else{
	this.touchHandler();
}
    var _this = this;  
	//运用定时器，每隔0.2秒移动蛇（舍得坐标变化，然后重绘）
	this.timer=setInterval(function(){
		//首先：解决蛇身跟随的问题；
		for(var i=_this.snakeBodyList.length-1;i>0;i--){
			_this.snakeBodyList[i].x=_this.snakeBodyList[i-1].x;
			_this.snakeBodyList[i].y=_this.snakeBodyList[i-1].y;
		}
		//其次：根据方向及坐标，处理舌头的移动新坐标
		var sHead=_this.snakeBodyList[0];
		switch(sHead.direct){
			case 'north':
			
			sHead.y-=1;
			break;
			case 'south':
			
			sHead.y+=1;
			break;
			case 'west':
			
			sHead.x-=1;
			break;
			case 'east':
			
			sHead.x+=1;
			break;
		}
		_this.start();
	//3.1.1 判断，蛇移动后新位置是否已经触边界，或触自身  true--dead
	_this.dead();//判断蛇生死，isDead
		if(_this.isDead){
			//alert你的最终分数
//			alert("Your score is:"+_this.score);
			//重新开始游戏restart（）方法
			clearInterval(_this.timer);//如果不清除定时器，则速度会不断加快
			_this.isDead = false;//改变isDead状态，否则，每次直接死掉
			_this.snakeBodyList = [];//清除蛇身，便于重新开始游戏，重绘初始界面
			_this.open();//游戏重新开始
		}else{
			//3.1.2 false：蛇活着，判断蛇头是否与食物的坐标点一致，如果一致，清空食物数组（多个食物时，可以使用标识位）
			_this.eat();//判断食物是否被吃，isEaten
			if(_this.isEaten){
			
				_this.isEaten = false;
				//清空食物数组
				_this.foodList = [];
				//加分
				_this.score += 10;
				//蛇身长一节
				var lastNodeIndex = _this.snakeBodyList.length;
				_this.snakeBodyList[lastNodeIndex] = {
					x:-2,
					y:-2,
					img:bodyImg,
					direct:_this.snakeBodyList[lastNodeIndex-1].direct
				};
			}
			//3.1.3 否则重绘
			_this.start();//重绘游戏画面（背景+蛇+食物）
		}
	},200);
		
	}
	/*
	 2.2画蛇：算法【{x:横坐标，y:纵坐标，img:图片，direct:运动方向}】
	 * */
	this.drawSnake=function(){
		//2.2.1循环生成snakeBodyList数组中的对象集合（默认，蛇居中）
		if(this.snakeBodyList.length<5){
		for(let i=0;i<5;i++){
			//【{x:横坐标，y:纵坐标，img:图片，direct:运动方向}】
			this.snakeBodyList.push({
				x:Math.floor(this.stepX)/2+i-2,//注意：x不是px像素坐标点而是x轴步数
				y:Math.floor(this.stepY)/2,//注意：y轴的步数；
				img:bodyImg,
				direct:"west",
			})
		}
//		console.log(this.snakeBodyList);
		this.snakeBodyList[0].img=westImg;
		}
		//2.2.2替换snakeBodyList  数组第一个元素的img替换成westimg图片
		
//		2.2.3遍历snakeBodyList，并画出蛇的初始状态
     for(let i=0;i<this.snakeBodyList.length;i++){
			var Node=this.snakeBodyList[i];
			this.ctx.drawImage(Node.img,Node.x*this.step,Node.y*this.step,this.step,this.step);
		}
	}
	/*
	 画食物
	 * */
	this.drawFood=function(){
		/*2.3.1当食物已经存在的时候，画面刷新时食物在原有位置重绘
		 */
		if(this.foodList.length > 0) {
			var fnode = this.foodList[0];
			this.ctx.drawImage(fnode.img, fnode.x * this.step, fnode.y * this.step, this.step, this.step);
			return;
		}
		//2.3.2如果食物没有（食物被吃或游戏初始化），生成x，y随机坐标，判断是否与蛇身重复
		//如果重复，重绘，调用this.drawfood(),否则，按照随机生成的点push到数组中，绘制图案
		var foodX = Math.floor(Math.random() * this.stepX);
		var foodY = Math.floor(Math.random() * this.stepY);
		var foodFlag = false; //判断食物与蛇身是否重复的标识位，true重复，false 不重复
		for(var i = 0; i < this.snakeBodyList.length; i++) {
			var snode1 = this.snakeBodyList[i];
			if(foodX == snode1.x && foodY == snode1.y) {
				foodFlag = true;
			}
		}
		if(foodFlag) {
			this.drawFood(); //如果重复，则重绘
		} else {
			this.foodList.push({
				x: foodX,
				y: foodY,
				img: foodImg
			}); //新生成一个食物
			var fnode = this.foodList[0];
			this.ctx.drawImage(fnode.img, fnode.x * this.step, fnode.y * this.step, this.step, this.step);
		}
		
		
	}
	/*
	 4.蛇死(碰到边界 或碰到自身)
	 * */
	this.dead=function(){
		const LEFT_END = 0;//左边界
		const RIGHT_END = this.stepX;//右边界
		const NORTH_END = 0;//上边界
		const SOUTH_END = this.stepY;//下边界
		const headX = this.snakeBodyList[0].x;//蛇头横坐标x
		const headY = this.snakeBodyList[0].y;//蛇头纵坐标y
		//判断边界
		if(headX < LEFT_END-1 || headY < NORTH_END-1 || headX > RIGHT_END || headY > SOUTH_END){
			this.isDead = true;
			return;//精简判断过程
		}
		//判断是否撞到自身
		for(var k = this.snakeBodyList.length-1;k>0;k--){
			if(this.snakeBodyList[k].x == headX && this.snakeBodyList[k].y == headY){
				this.isDead = true;
			}			
		}
	}
	/*
	 5.分数
	 * */
	this.eat=function(){
		const HEAD_X = this.snakeBodyList[0].x;//蛇头横坐标x
		const HEAD_Y = this.snakeBodyList[0].y;//蛇头纵坐标y
		const FOOD_X = this.foodList[0].x;//食物横坐标x
		const FOOD_Y = this.foodList[0].y;//食物纵坐标y
		if(HEAD_X == FOOD_X && HEAD_Y == FOOD_Y){
			this.isEaten = true;
		}
	}
}
