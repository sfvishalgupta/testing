class NewAngle 
{
	constructor(game,config,lines,color)
	{
		this.game = game;
		this.config = config;
		this.color = color;
		this.oLines = lines;
		this.sAngle = 0;
		this.eAngle = 0;
		this.radius = this.config.interactive ? 50 : 45;
		this.isButton = this.config.interactive;
		this.setIntersectionPoint();

		var cx = game.world.centerX,
			cy = game.world.centerY;
		this.ui = new Phaser.Sprite(game,0,0);

		if(this.intersectionPoint ){	
			//this.debugCircle();
			this.draw();
			this.ui = new Phaser.Image(game,0,0);
			this.ui.addChild(this.graphics);
			this.ui.hitArea = this.graphics.getBounds();
			if(this.isButton){
				this.ui.inputEnabled = true;
				this.ui.input.useHandCursor = true;	
				this.ui.events.onInputOver.add(function(sprite){
					sprite.alpha = 0.5;
				},this);
				this.ui.events.onInputOut.add(function(sprite){
					sprite.alpha = 1;
				},this);
				this.ui.events.onInputUp.add(function(sprite){
					console.log(111);
				},this);
				this.setText("I");
			}else{
				this.setText("N");
			}
			this.ui.position.x = cx;
			this.ui.position.y = cy;
			
		}
	}

	debugCircle(){
		var game = this.game,
			cx = game.world.centerX,
			cy = game.world.centerY;
		var graphics = game.add.graphics(cx,cy);
		graphics.clear();
		graphics.beginFill(0x00FF00);
		graphics.arc(0,0, 15, 0,3.14*2, false);

		graphics.endFill(); 

		this.debugGraphics = graphics;
	}

	setIntersectionPoint()
	{
		var oAngle = this.config,
			aLine1 = oAngle.lineA.split("."),
			aLine2 = oAngle.lineB.split("."),
			line1 = this.oLines[aLine1[0]],
			line2 = this.oLines[aLine2[0]],
			pt1 = line1.config[aLine1[1]],
			pt2 = line2.config[aLine2[1]],
			pts1 = new Phaser.Point(pt1.x,pt1.y),
			pts2 = new Phaser.Point(pt2.x,pt2.y),
			inter = Utils.getIntersactionPoint(line1,line2);
		if(inter){
			var from = Phaser.Point.subtract(pts1,inter),
				to = Phaser.Point.subtract(pts2,inter);

			this.sAngle = Phaser.Point.angle(from,new Phaser.Point()),
			this.eAngle = Phaser.Point.angle(to,new Phaser.Point());

			this.clockwise = this.sAngle < this.eAngle ? false : true;
		}
		this.intersectionPoint = inter;
	}

	draw()
	{
		var game = this.game,
			sAngle = this.sAngle,
			eAngle = this.eAngle,
			color = this.color,
			isButton = this.isButton;

		this.graphics = new Phaser.Graphics(game, 0, 0);
		this.graphics.clear();
		this.graphics.beginFill(color);
		for(var i=0;i<60;i++){
			//this.graphics.arc(0,0, i, sAngle,2*3.14 - eAngle, true);
			this.graphics.arc(
				this.intersectionPoint.x,
				this.intersectionPoint.y, 
				i, sAngle,eAngle, false
			);
		}
		this.graphics.endFill(); 
		this.graphics.boundsPadding = 0;
	}

	setText(txt){
		var game = this.game,
			style = {fill:'#00FF00',font: "bold 20px Arial"},
			diff = (this.eAngle - this.sAngle)/2;

		var angle = this.clockwise ? this.sAngle : this.eAngle;
		//angle = angle-diff;
		console.log(angle,this.sAngle,this.eAngle);

		var pos = {
			x : this.ui.width + 40*Math.cos(angle),
			y : this.ui.height + 40*Math.sin(angle)
		}
		
		this.textLabel = new Phaser.Text(game,pos.x,pos.y,txt,style);
		this.ui.addChild(this.textLabel);
	}

	update()
	{
		this.textLabel.angle = this.ui.angle;
	}
}

//game,config,lines,color

class tweenObj 
{
	constructor()
	{
		this._foo = 10;
	}

	get bar(){
		return this._foo;
	}

	set bar(ang){
		this._foo = ang;
		console.log(ang);
	}
}
class TestState
{
	constructor()
	{

	}

	create()
	{
		this.setupgame();
		var game = this.game;
		game.stage.backgroundColor = '#ccc';

		var itzi = game.add.sprite(100,100,"itzi");
		game.physics.box2d.enable(itzi);
		itzi.body.setCircle(itzi.width/2);
		itzi.body.static = true;
		
return;
var skin = new Phaser.Physics.Box2D.Body(game, itzi, 100, 100, 2);
	    skin.setCircle(20);
	    skin.bullet = true;
		console.log(skin);


		var menu_panel = new GameFail(game,0,300);
		this.add.existing(menu_panel);

		return;

		var a = new tweenObj();
		var b = {
			_foo : 10,
			get bar(){
				return this._foo;
			},

			set bar(ang){
				console.log(ang);

			}
		};

		//var tw = game.add.tween(b).to({bar:30}, 1000, "Linear",true).yoyo(true);


		var graphics = new Phaser.Graphics(game,0,0);
		var side = 20;
		graphics.clear();
		graphics.lineStyle(2,0x000000);
		graphics.beginFill(0xFE0000);
		graphics.moveTo(0,side);
		graphics.lineTo(0,-side);
		graphics.lineTo(1.71*side,0);
		graphics.endFill();

		
		var sp = game.add.sprite(100,100,graphics.generateTexture());
		sp.tint = 0;
		sp.alpha = .3;
		sp.scale.set(1.2,1.2);
		var sp = new Phaser.Sprite(game,100,100,graphics.generateTexture());
		this.sp = sp;


return;
		var sprite = new Phaser.Image(game,0,0,'goldFly',5);
		var sprite2 = new Phaser.Image(game,0,0,'goldFly',1);
		var bmd = game.make.bitmapData(53,40);
		bmd.load(sprite);
		bmd.replaceRGB(0, 0, 0, 255, 0, 0, 0, 0);
		var bmd1 = game.make.bitmapData(53,40);
		bmd1.alphaMask(sprite2,bmd);
		game.add.image(400, 0, bmd1);

	}
	update()
	{

	}
	render() 
	{
		 this.game.debug.box2dWorld();
	}
	setupgame()
	{
		
		var game = this.game;
		

	    // Enable Box2D physics
	    game.physics.startSystem(Phaser.Physics.BOX2D);
	    //game.physics.box2d.debugDraw.joints = true;
	    game.physics.box2d.gravity.y = 500;
	    //game.physics.box2d.restitution = 0.1
	    //game.physics.box2d.friction = 300;

	    game.physics.box2d.debugDraw.centerOfMass = true;
game.physics.box2d.setBoundsToWorld();

	
	}
}