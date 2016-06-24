class SpikeBallPath extends Phaser.Sprite
{
	constructor(game,config){
		super(game,game.world.centerX,game.world.centerY);
		this.config = config;
		this.game = game;
		this.type = config.type;
		this.graphics = new Phaser.Graphics(game,0,0);
		this.anchor.set(0.5,0.5);
		switch(config.type){
			case global_config.Objects.SpikeBall.Type_Line:
				this.drawLine();
			break;
			case global_config.Objects.SpikeBall.Type_Circle:
				this.drawCircle();
			break;
			default:
			break;
		}
		this.addChild(this.graphics);
	}
	
	drawLine()
	{
		var game = this.game,
			graphics = this.graphics,
			config = this.config,
			path = config.path,
			x1 = path.a.x * global_config.Config.scale*game.isFlipped,
			y1 = path.a.y * global_config.Config.scale,
			x2 = path.b.x * global_config.Config.scale*game.isFlipped,
			y2 = path.b.y * global_config.Config.scale;

		graphics.clear();
		graphics.beginFill(0xcccccc);
    	graphics.lineStyle(1, 0xcccccc);
    	graphics.moveTo(x1,y1);
    	graphics.lineTo(x2, y2);
    	graphics.endFill();
	}

	drawCircle()
	{
		var game = this.game,
			graphics = this.graphics,
			path = this.config.path,
			x = path.pos.x * global_config.Config.scale*game.isFlipped,
			y = path.pos.y * global_config.Config.scale,
			radius = path.pathRadius * global_config.Config.scale,
			startAngle = Phaser.Math.degToRad(path.pathArcStart),
			endAngle = Phaser.Math.degToRad(path.pathArcEnd);

		graphics.clear();
    	graphics.lineStyle(1, 0xcccccc);
		graphics.arc(x,y,radius,startAngle,endAngle, false);
    	graphics.endFill();
	}
}
class SpikeBall extends Phaser.Sprite
{
	constructor(game, cnf)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = cnf.pos.x*global_config.Config.scale*game.isFlipped,
			y = cnf.pos.y*global_config.Config.scale;

		super(game,cx,cy);

		this.config = cnf;
		this.game = game;
		this.type = cnf.type;
		this.anchor.set(0.5,0.5);

		var skin = new Phaser.Physics.Box2D.Body(game, null,cx, cy, 100);
    	skin.setCircle(19,0,0);
    	skin.static = true;
    	skin.sensor = true;
    	this.skin = skin;
    	this.addSpikeBall();
	}

	addSpikeBall()
	{
		var game = this.game,
			cnf = this.config,
			cx = game.world.centerX,
			cy = game.world.centerY,
			image = global_config.Images.SpikeBall,
			x = cnf.pos.x*global_config.Config.scale*game.isFlipped,
			y = cnf.pos.y*global_config.Config.scale,
			ball = new Phaser.Sprite(game,0,0,image.frame);

		if(image.frameName){
			ball.frameName = image.frameName;
		}
		ball.anchor.set(0.5,0.5);
		//this.body.addChild(ball);
		this.addChild(ball);
		this.ball = ball;
		
    	if(cnf.type == global_config.Objects.SpikeBall.Type_Line){
    		var x1 = cnf.path.a.x*global_config.Config.scale,
    			y1 = cnf.path.a.y*global_config.Config.scale,
    			x2 = cnf.path.b.x*global_config.Config.scale,
    			y2 = cnf.path.b.y*global_config.Config.scale;
    		this.ball.pivot.x = -x1;
    		this.ball.pivot.y = -y1;
    		game.add.tween(this.ball.pivot).to({x:-x2, y:-y2}, cnf.moveSpeed*1000, "Linear", true,0,-1).yoyo(true);

    	}else if(cnf.type == global_config.Objects.SpikeBall.Type_Circle){
    		var x1 = cnf.path.pos.x*global_config.Config.scale,
    			y1 = cnf.path.pos.y*global_config.Config.scale,
    			radius = cnf.path.pathRadius * global_config.Config.scale,
    			a1 = Phaser.Math.degToRad(90-cnf.path.pathArcStart),
    			a2 = Phaser.Math.degToRad(90-cnf.path.pathArcEnd);

    		this.ball.pivot.x = -x1;
    		this.ball.pivot.y = -y1;
    		this.skin.setCircle(19,x,y);
    		if(a2>a1){
    			this.startAngle = a1;
    			this.endAngle = a2;	
    		}else{
    			this.startAngle = a2;
    			this.endAngle = a1;	
    		}
    		cnf.moveSpeed = 2*cnf.moveSpeed;
    		var diff = this.endAngle-this.startAngle,
    			delta = diff/(60*cnf.moveSpeed),
    			n = 1,
    			tw = game.add.tween({vis:1}).to({vis:"+1"}, cnf.moveSpeed*1000, "Linear",false,0,-1);

    		if((cnf.path.pathArcEnd - cnf.path.pathArcStart)%360 > 0){
    			tw.yoyo(true);
    		}
    		tw.onUpdateCallback(function(a,b,c){
    			var a = this.startAngle + delta*n,
    				x = radius*Math.sin(a),
    				y = radius*Math.cos(a);
    			this.ball.position.set(x,y);
    			n = c.inReverse ? n-1 : n+1;
    		},this);
    		tw.start();
    	}else{
    		this.pivot.x = -x;
    		this.pivot.y = -y;
    		this.skin.setCircle(19,x,y);
    	}
	}

	update()
	{
		var game = this.game,
			cnf = this.config,
			cx = game.world.centerX,
			cy = game.world.centerY;

		if(cnf.type == global_config.Objects.SpikeBall.Type_Line)
		{
			this.skin.setCircle(19,
    			this.ball.position.x - this.ball.pivot.x,
    			this.ball.position.y - this.ball.pivot.y
    		);
		}
		else if(cnf.type == global_config.Objects.SpikeBall.Type_Circle)
		{
    		this.skin.setCircle(19,
    			this.ball.position.x - this.ball.pivot.x,
    			this.ball.position.y - this.ball.pivot.y
    		);
    	}
	}
}