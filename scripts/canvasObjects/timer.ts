class Timer extends Phaser.Sprite
{
	constructor(game)
	{
		var cnf = global_config.Images.Timer;
		super(game,cnf.x,cnf.y,cnf.frame);
		if(cnf.frameName){
			this.frame = frameName;
		}

		this.addCounter();
		this.game.onClockTick.add(function(timeLimit){
			timeLimit = timeLimit/1000;
			var min = parseInt(timeLimit/60),
				sec = (timeLimit%60)+"";
			if(sec.length < 2) sec = "0"+sec;
			this.counter.text = min + ":" + sec;
	    },this);

	    this.game.onGameEnd.add(function(){
	    	this.counter.text = "0:00";
	    },this);
	}

	addCounter()
	{
		var game = this.game,
			style = {fill:'#000000',font: "bold 40px Arial",stroke : '#FFFFFF',strokeThickness : 3},
			text = new Phaser.Text(game,120, this.height/2,"0:00",style);
			
		text.anchor.set(0.5,0.5);
		this.addChild(text);
		this.counter = text;
	}
}