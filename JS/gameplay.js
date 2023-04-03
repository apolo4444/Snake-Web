var activate=false;
var gameOver=false;
var pointerX=0;
var pointerY=0;
var distX=0;
var distY=0;

GamePlayManager={

    init: function(){
        game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally=true;
        game.scale.pageAlignVertically=true;

        this.lives=3;
        this.score=0;
        this.speed=100;
        this.snakeX=this.speed*0.03;
        this.snakeY=this.speed*0.03;
        this.i=0;
        this.currentScore=0;


    },

    preload:function(){
       game.load.image("fondo","./SRC/IMAGES/fondo.png");
       game.load.image("snake","./SRC/IMAGES/snakeHead.png");
       game.load.image("bola","./SRC/IMAGES/snakeBody.png");
       game.load.audio("audio","./SRC/SOUNDS/Audio_3_.mp3");
    },

    increaseScore:function(){
        //cambia el sprite del caballo cuando agarra un diamante durante un tiempo determinado
        this.currentScore+=100;
        this.scoreText.text = this.currentScore;

    },

    gamePanel:function(){
        var screen = game.add.bitmapData(game.width, game.height);
        screen.ctx.fillStyle = '#FF00FF';
        screen.ctx.fillRect(0,0,game.width, game.height);

        var bg = game.add.sprite(0,0,screen);
        bg.alpha = 1;

        return bg;
    },

    showFinalMessage:function(msg){
        
        var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }
        //Crea un bitmap con el texto
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0,game.width, game.height);
        bgAlpha.ctx.font="60px Arial";
        bgAlpha.ctx.fillStyle="#FFFFFF";
        bgAlpha.ctx.fillText(msg,game.width/4, game.height/2);
    
        //Crea un sprite con el bitmap
        var bg = game.add.sprite(0,0,bgAlpha);
        bg.alpha = 0.5;
       
        
       return bg;
  
    },

    onTap: function(){

        activate=true;
        
    },

    ballXY: function(ball){
        ball.x=game.rnd.integerInRange(10,640);
        ball.y=game.rnd.integerInRange(10,640);
       
        
    },

    create:function(){
        //this.fondo=game.add.sprite(0,0,"fondo");
        this.fondo=this.gamePanel();
       /*  this.snake=game.add.sprite(0,0,"snake");
        this.snake.anchor.setTo(0.5,0.5);
        this.snake.x=game.width/2;
        this.snake.y=game.height/2; */

        this.snake=[];
        this.snake[this.i]=game.add.sprite(0,0,"snake");
        this.snake[this.i].anchor.setTo(0.5,0.5);
        this.snake[this.i].x=game.width/2;
        this.snake[this.i].y=game.height/2;

        this.ball=game.add.sprite(0,0,"bola");
        this.ball.anchor.setTo(0.5,0.5);
        this.ballXY(this.ball);

        

        game.input.onDown.add(this.onTap,this);

       
        var style = {
            font: 'bold 30pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }

        this.scoreText = game.add.text(game.width/2, 20, this.currentScore, style);
        this.scoreText.anchor.setTo(0.5);

        this.livesText=game.add.text(20,20,this.lives, style);
        this.livesText.anchor.setTo(0.5);

        if(activate!=false){
            this.loop=game.sound.add("audio");
            this.loop.play();
        }
       
    },
    getBoundsBlock: function(currentDiamond){
        //Devuelve un rectangulo con las mismas dimenciones que los sprites
        return new Phaser.Rectangle(currentDiamond.left,currentDiamond.top,currentDiamond.width,currentDiamond.height);

    },

    isRectanglesOverlapping: function(rect1, rect2) {
        if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
        }
        if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },

    /*  snakeMove:function(snake){
        var pointerX=game.input.x;
        var pointerY=game.input.y;

        var distX=pointerX-snake.x;
        var distY=pointerY-snake.y;

        snake.x+=distX*0.02;
        snake.y+=distY*0.02;
    },  */

     snakeMove:function(){
        pointerX=game.input.x;
        pointerY=game.input.y;

        distX=pointerX-this.snake[0].x;
        distY=pointerY-this.snake[0].y;

        this.snake[0].x+=distX*0.02;
        this.snake[0].y+=distY*0.02;


        for(let j=this.snake.length-1;j>0;j--){ 
            this.snake[j].x=this.snake[j-1].x;
            this.snake[j].y=this.snake[j-1].y;   
            this.snake[j].x-=distX*0.02;
            this.snake[j].y-=distY*0.02;   
        }  

        this.snakeRect=this.getBoundsBlock(this.snake[0]);
        this.ballRect=this.getBoundsBlock(this.ball);

        if(this.isRectanglesOverlapping(this.snakeRect,this.ballRect)){
            this.ballXY(this.ball);
            this.increaseScore();
            this.increaseBody();
        }
        
        for(let j=this.snake.length-1;j>15;j--){
                this.bodyRect=this.getBoundsBlock(this.snake[j]);
                if(this.isRectanglesOverlapping(this.snakeRect,this.bodyRect)){
                    this.lives--;
                   
                    this.livesText.text=this.lives;
                    this.i=0;
                    this.create();
                  
                }
        }          
        
    }, 

    increaseBody:function(){
        this.i++;
        //this.snake[this.i]=game.add.sprite(this.snake[this.i-1].x-this.snake[this.i-1].width/2,this.snake[this.i-1].y-this.snake[this.i-1].height/2,"bola");
        this.snake[this.i]=game.add.sprite(this.snake[this.i-1].x-distX*0.02,this.snake[this.i-1].y-distY*0.02,"bola");
        this.snake[this.i].anchor.setTo(0.5,0.5);
       /*  this.snake[this.i].x=this.snake[this.i-1].x;
        this.snake[this.i].y=this.snake[this.i-1].y; */
    },

    update:function(){
        if(!gameOver){
            if(activate){
             
              this.snakeMove();

              if(this.lives<=0){
                this.gameOver=true;
                this.activate=false;
                this.showFinalMessage("GAME OVER");
              }
                
            }
        }
    }

}

var game= new Phaser.Game(1136,640,Phaser.AUTO);
game.state.add("gameplay",GamePlayManager);
game.state.start("gameplay");