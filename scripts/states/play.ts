class PlayState 
{
	constructor(level,stage){
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
		this.game.isFlipped = 1;
		var allLevels = this.game.cache.getJSON('level')["levels"],
			stage = allLevels[global_config.stage],
			level = stage[global_config.level],
			game = this.game,
			interactiveColor = Utils.getRandomElement(global_config.AngleColors),
			blueFlyLength = typeof level.blueFlies != "undefined" ? level.blueFlies.length : 0;

		game.add.image(0,0,global_config.world);

	    this.setupGame();
		
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
	    		this.oLines[oAngle.triggeredLine].updateLineTriggered(interactiveColor);
	    		color = interactiveColor;
	    	}

	    	var ang = new Angle(game,oAngle,this.oLines,color);
	    	game.add.existing(ang);
    		this.rotatingElements.push(ang);
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
	    	game.add.existing(this.oLines[i]);
	    }

	    for(var i in level.spikeBall){
	    	var config = level.spikeBall[i],
	    		spikeBall = new SpikeBall(game, config),
	    		spikeBallPath = new SpikeBallPath(game,config);

	    	this.add.existing(spikeBallPath);
	    	this.add.existing(spikeBall);
	    	this.rotatingElements.push(spikeBall);
	    	this.rotatingElements.push(spikeBall.skin);
	    	this.rotatingElements.push(spikeBallPath);
	    }

	    for(var i in level.springPad){
	    	var config = level.springPad[i],
	    		springPad = new SpringPad(game, config);
	    	this.add.existing(springPad);
	    	this.rotatingElements.push(springPad);
	    	this.rotatingElements.push(springPad.skin);
	    	springPad.skin.sprite = springPad;
	    	this.itzi.skin.setBodyContactCallback(springPad.skin,this.itziOnSpringPad,this);
	    }

	    this.itzi.skin.setBodyContactCallback(this.gate.skin,this._gameComplete,this);

	    this._addCogWheel();

	    this._addBeeCounter();
	    
	    this.addHealtBar();

	    this.addTimer();

	    this.addActionButtons();
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

	setupGame()
	{
		var game = this.game;
		game.stage.backgroundColor = '#000000';

	    // Enable Box2D physics
	    game.physics.startSystem(Phaser.Physics.BOX2D);
	    //game.physics.box2d.debugDraw.joints = true;
	    game.physics.box2d.gravity.y = 500;
	    game.physics.box2d.restitution = 0.1;
	    game.physics.box2d.friction = 300;
	}

	addActionButtons()
	{
		var game = this.game,
			pauseCnf = global_config.Images.GamePause,
			helpCnf = global_config.Images.GameHelp,
			replayCnf = global_config.Images.GameReplay;

		this.pauseButton = new Phaser.Button(game, pauseCnf.x, pauseCnf.y, pauseCnf.frame);
		this.pauseButton.inputEnabled = true;
		this.pauseButton.input.useHandCursor = true;
		this.add.existing(this.pauseButton);

		this.helpButton = new Phaser.Button(game, helpCnf.x, helpCnf.y, helpCnf.frame);
		this.helpButton.inputEnabled = true;
		this.helpButton.input.useHandCursor = true;
		this.add.existing(this.helpButton);

		this.replayButton = new Phaser.Button(game, replayCnf.x, replayCnf.y, replayCnf.frame);
		this.replayButton.inputEnabled = true;
		this.replayButton.input.useHandCursor = true;
		this.add.existing(this.replayButton);

		this.pauseButton.onInputUp.add(function(event){
			this.loadMenuScreen();
		},this);
	}

	loadMenuScreen()
	{
		//this.game.state.add("Menu", new MenuState(),true);
		window.location.reload();
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

	itziOnSpringPad(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    //if(body2.x + 67 == body1.x)
	    	body2.sprite.activate();
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

		this.blueBeeCounter = new BlueBeeCounter(game);
		this.blueBeeCounter.setTotalBeeCount(this.blueFlies.length);
		this.add.existing(this.blueBeeCounter);

		this.goldBeeCounter = new GoldBeeCounter(game);
		this.goldBeeCounter.setTotalBeeCount(this.goldFlies.length);
		this.add.existing(this.goldBeeCounter);
	}

	addHealtBar()
	{
		var game = this.game;
		this.healthBar = new HealthBar(game);
		this.add.existing(this.healthBar);
	}

	addTimer()
	{
		this.timer = new Timer(this.game);
		this.add.existing(this.timer);
	}
}