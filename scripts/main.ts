class Preloader
{
	constructor()
	{

	}

	preload()
	{
		var build = "build/";
		this.game.load.json("level",build+"level.json");
		this.game.load.json("app",build+"app.json");
		
		this.game.load.image("cog","assets/cog-main.png");
		this.game.load.image("cog_small","assets/cog-small.png");
		this.game.load.image("itzi","assets/itzi.png");
		this.game.load.image("texture","assets/line_texture.jpg");
		this.game.load.image("beeCounter","assets/counter-bee-bg.png");
		this.game.load.image("blueBee","assets/bee-counter-blue-only.png");
		this.game.load.image("goldBee","assets/bee-counter-yellow-only.png");
		this.game.load.image("colors","assets/colors.png");
		this.game.load.image("conveyor","assets/conveyor.png");
		
		// Load backgrounds 
		this.game.load.image("world01","assets/backgrounds/world01.jpg");
		this.game.load.image("world02","assets/backgrounds/world02.jpg");
		this.game.load.image("world03","assets/backgrounds/world03.jpg");
		this.game.load.image("world04","assets/backgrounds/world04.jpg");
		this.game.load.image("world05","assets/backgrounds/world05.jpg");
		this.game.load.image("world06","assets/backgrounds/world06.jpg");
		

		this.game.load.spritesheet('blueFly','assets/blue_fly.jpg', 53, 40);
		this.game.load.spritesheet('goldFly','assets/gold_fly.jpg', 53, 40);

		this.game.load.spritesheet("gate","assets/gate_texture.png",61, 62);
		this.game.load.spritesheet("gateTwirl","assets/gate_twirl_texture.png",52, 52);
		this.game.load.spritesheet("GateLightAnim","assets/gate_light_anim.png",17, 17);
		this.game.load.spritesheet("GateLight","assets/gate_light.png",31, 32);
	}

	create()
	{
		global_config = Utils.merge_objects(global_config,this.game.cache.getJSON('app'));
		/*
		var bmd = this.game.make.bitmapData(200, 20);
		bmd.draw("colors",0,0);
		bmd.update();
		for(var i=0;i<10;i++){
			var color = bmd.getPixelRGB(20*i, 5);
			global_config.LaserLineColors = 
			console.log(Phaser.Color.RGBtoString(color.r,color.g,color.b,color.a));
		}
		*/
		this.game.state.add("Play", new MainState(),true);
	}
}

class MainState 
{
	constructor(){
		this.cursor = null;
		this.rotatingElements = [];
		this.itzi = null;
		this.blueFlies = [];
		this.goldFlies = [];
		this.oLines = [];
		this.blueBeeCollected = 0;
		this.goldBeeCollected = 0;
	}

	create() 
	{
		var allLevels = this.game.cache.getJSON('level')["levels"],
			stage = allLevels[global_config.stage],
			level = stage[global_config.level],
			game = this.game,
			blueFlyLength = typeof level.blueFlies != "undefined" ? level.blueFlies.length : 0;

		game.add.image(0,0,global_config.world);

	    this._setupGame();
		
		 /** Adding Lines */
	    for(var i in level.lines){
	    	var lineCnf = level.lines[i],
	    		line = null;
	    		
	    	switch(lineCnf.type)
	    	{
	    		case "info" :
	    			line = new InfoLine(game,lineCnf);
	    		break;
	    		case "laser":
	    			line = new LaserLine(game,lineCnf);
	    		break;
	    		case "conveyor":
	    			line = new ConveyorLine(game,lineCnf);
	    		break;
	    		default:
	    			line = new SimpleLine(game,lineCnf);
	    		break;
	    	}

	    	this.oLines[lineCnf.id] = line;
    		this.rotatingElements.push(line);

    		if(global_config.debug){
	    		var text = new DebugText(game, lineCnf, lineCnf.id);
    			game.add.existing(text);
    			this.rotatingElements.push(text);
	    	}
	    }

	    /** Addng Angles */
	    for(var i in level.angles){

	    	var oAngle = level.angles[i],
	    		color = global_config.Config.angleDefaultColor,
	    		range = [];

	    	if(oAngle.interactive){
	    		color = Utils.getRandomElement(global_config.AngleColors);
	    		this.oLines[oAngle.triggeredLine].updateLineTriggered(color);
	    	}

	    	var ang = new Angle(game,oAngle,this.oLines,color);
	    	game.add.existing(ang);
    		this.rotatingElements.push(ang);

    		if(oAngle.interactive){
				ang.onInputUp.add(this._onAngleClick.bind(this));
    		}
	    }

	    for(var i in level.levelShape){
	    	var levelShape = new LevelShape(game,level.levelShape[i]);
	    	this.add.existing(levelShape);
	    	this.rotatingElements.push(levelShape);
	    }


		// Adding Gate
		this.gate = new Gate(game,level.gate, blueFlyLength);
	    this.game.add.existing(this.gate);
	    this.rotatingElements.push(this.gate);
	    
	    // Adding Itzi
	    this.itzi = new Itzi(game,level.itzi);
	    game.add.existing(this.itzi);

	    for(var i in level.blueFlies)
	    {
	    	var bFly = level.blueFlies[i],
	    		fly = new BlueFly(game,bFly);
	    	this.blueFlies.push(fly);
	    	this.add.existing(fly);
	    	this.rotatingElements.push(fly);
	    	this.itzi.skin.setBodyContactCallback(fly.skin,this._blueFileCollected,this);
	    }

	    for(var i in level.goldFlies)
	    {
	    	var gFly = level.goldFlies[i],
	    		fly = new GoldFly(game,gFly);
	    	this.goldFlies.push(fly);
	    	this.add.existing(fly);
	    	this.rotatingElements.push(fly);
	    	this.itzi.skin.setBodyContactCallback(fly.skin,this._goldFileCollected,this);
	    }

	    for(var i in this.oLines){
	    	//if(i == "line12" || i == "line27" || i == "line28")
	    	game.add.existing(this.oLines[i]);
	    }

	    this.itzi.skin.setBodyContactCallback(this.gate.skin,this._gameComplete,this);

	    this._addCogWheel();

	    this._addBeeCounter();
	    
	    this.cursor = this.input.keyboard.createCursorKeys();
	}

	update()
	{
		var angularSpeed = 0;

		if (this.cursor.left.isDown) {
			angularSpeed += -1;
		}
		else if (this.cursor.right.isDown) {
			angularSpeed += +1;
		}

		var backupVel = this.itzi.skin.velocity.x;
		this.itzi.skin.velocity.x = backupVel + 0.0001;
		this.itzi.skin.velocity.x = backupVel;

		for(var i in this.rotatingElements){
			this.rotatingElements[i].angle += angularSpeed;
		}
		this.smallCog.angle -= (angularSpeed * 20 / 3);
		//this.itzi.angle = Math.max(Math.min(this.itzi.angle, 30), -30);
	}

	render() 
	{
		 //this.game.debug.box2dWorld();
	}

	_onAngleClick(oAngle)
	{
		console.log("interactive click");
		this.oLines[oAngle.triggeredLine].enbaleTriggerClick();
		oAngle.enbaleTriggerClick();
	}

	_setupGame()
	{
		var game = this.game;
		game.stage.backgroundColor = '#000000';

	    // Enable Box2D physics
	    game.physics.startSystem(Phaser.Physics.BOX2D);
	    //game.physics.box2d.debugDraw.joints = true;
	    game.physics.box2d.gravity.y = 500;
	    game.physics.box2d.restitution = 0.1;
	    game.physics.box2d.friction = 100;
	}

	_addCogWheel()
	{
		var game = this.game,
			cx = game.world.centerX,
	    	cy = game.world.centerY,
	    	polygonPoints = [],
	    	theta = 0,
			cog_circle = new Phaser.Physics.Box2D.Body(game, null, cx, cy, 100),
			cog = game.add.sprite(cx,cy,"cog"),
			radius = (cog.width/2) - 26;

		for (theta = 0; theta <= 2 * Math.PI; theta += 2 * Math.PI / 100) 
		{
        	polygonPoints.push(0 + (radius * Math.cos(theta)));
        	polygonPoints.push(0 - (radius * Math.sin(theta)));
        }

		cog.anchor.set(0.5,0.5);
		cog_circle.setChain(polygonPoints);
		this.rotatingElements.push(cog);

		this.smallCog = game.add.image(70,312,"cog_small");
		this.smallCog.anchor.set(0.5,0.5);

		this.itzi.skin.setBodyContactCallback(cog_circle,this._itziBoundryTouch,this);
	}

	_blueFileCollected(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    this.blueBeeCollected++;
	    this.blueBeeCounter.updateBeeCollected(this.blueBeeCollected);
	    body2.sprite.destroy();
	    body2.destroy();
	    this.gate.collectFile();
	}

	_goldFileCollected(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    this.goldBeeCollected ++;
	    this.goldBeeCounter.updateBeeCollected(this.goldBeeCollected);
	    body2.sprite.destroy();
	    body2.destroy();
	}

	_gameComplete(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }

	    if(this.gate.isOpenable){
	    	this.itzi.position.x = this.gate.position.x - this.gate.pivot.x;
		    this.itzi.position.y = this.gate.position.y - this.gate.pivot.y;

		    this.itzi.destroy();
		    this.gate.openGate();
	    }
	}

	_itziBoundryTouch(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    console.log("itzi touch boundry")
	}

	_addBeeCounter()
	{
		var game = this.game;

		this.blueBeeCounter = new BlueBeeCounter(game,640,70);
		this.blueBeeCounter.setTotalBeeCount(this.blueFlies.length);
		this.add.existing(this.blueBeeCounter);

		this.goldBeeCounter = new GoldBeeCounter(game,640,130);
		this.goldBeeCounter.setTotalBeeCount(this.goldFlies.length);
		this.add.existing(this.goldBeeCounter);
	}
}

var obj = Utils.getQueryParams(),
	level = Utils.getLevel(obj.level),
	stage = obj.stage || 1,
	global_config = {
		stage : "S"+stage,
		level : "L"+level,
		world : "world0"+stage,
		debug : false
	};

new Phaser.Game(800, 600, Phaser.CANVAS, 'container', new Preloader());