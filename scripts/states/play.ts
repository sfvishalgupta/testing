class PlayState extends Phaser.State
{
	constructor(level,stage){
		super();
		this.cursor = null;
		this.rotatingElements = [];
		this.itzi = null;
		this.blueFlies = [];
		this.goldFlies = [];
		this.oLines = [];
		this.springPads = [];
		this.blueBeeCollected = 0;
		this.goldBeeCollected = 0;
		this.isGameRunning = false;
	}

	create() 
	{
		this.game.isFlipped = 1;
	    this.setupGame();
	    this.addCogWheel();
	    this.addGamePanels();

	    var game = this.game;
	    game.onGameStart.addOnce(function(timeLimit){
	    	this.timeRemaining = timeLimit;
	    	this.startClockTick();
	    },this);
	    
	    game.onGameEnd.addOnce(function(reason){
	    	this.endGame(reason);
	    },this);

	    game.onItziDestroy.addOnce(function(){
	    	if(this.timeRemaining >= -1000){
	    		//this.timeRemaining = -1000;
	    		this.game.onGameEnd.dispatch(global_config.GameEndType.Itzy_fried);
	    	}
	    },this);

	    
	    this.fireSprite = new FireSprite(game);
		this.add.existing(this.fireSprite);

		this.gameStartPanel.toggle();
	}

	addCanvasObjects()
	{
		var game = this.game;
		this.canvasObjects = new CanvasObjects(game);
	    this.canvasObjects.updateBeeCounter(
	    	this.blueFlies.length,
	    	this.goldFlies.length
	    );
	    this.add.existing(this.canvasObjects);
	}

	addCogWheel()
	{
		var game = this.game;

		game.physics.box2d.restitution = 1.5;
	    game.physics.box2d.friction = 100;
		
		this.smallCog = new SideCog(game);
		game.add.existing(this.smallCog);

		this.mainCog = new MainCog(game);
		game.add.existing(this.mainCog);
	}

	addGamePanels()
	{
		var game = this.game;

		this.gameFailPanel = new GameFail(game,0,300);
		game.add.existing(this.gameFailPanel);
		this.gameFailPanel.selectBtn.events.onInputUp.add(function(){
			game.state.start("Menu");
		},this);

		this.gamePausedPanel = new GamePause(game,0,300);
		game.add.existing(this.gamePausedPanel);

		this.gameQuitConfirmPanel = new GameQuitConfirm(game,0,300);
		game.add.existing(this.gameQuitConfirmPanel);

		this.gameStartPanel = new GameStart(game,0,300);
		game.add.existing(this.gameStartPanel);
		this.gameStartPanel.startBtn.events.onInputUp.add(this.startGame,this);
	}

	addLevelObjects()
	{
		var allLevels = this.game.cache.getJSON('level')["levels"],
			stage = allLevels[global_config.stage],
			level = stage[global_config.level],
			game = this.game,
			blueFlyLength = typeof level.blueFlies != "undefined" ? level.blueFlies.length : 0;

		// Variables
		this.gameTimeLimit = level.time*1000 || 200000;
		//this.gameTimeLimit = 6000;
		game.physics.box2d.gravity.y = 500;
	    game.physics.box2d.restitution = 0.1
	    game.physics.box2d.friction = 300;

		// Objects
		this.addBlueFlies(level.blueFlies);
		this.addGoldFlies(level.goldFlies);
		
		this.addLines(level.lines);
		this.addAngles(level.angles);
		this.addLevelShapes(level.levelShape);
		this.addInfoCircle(level.infoCircle);
		this.addAnnotationText(level.annotationText);
	    this.addGate(level.gate,blueFlyLength);
	    this.addSpikeBall(level.spikeBall);
	    this.addSpringPad(level.springPad);
	    this.addHintPanel(level.hintImageID,level.hintTextID)

	    this.addItzi(level.itzi);
	    this.itzi.body.setBodyContactCallback(this.gate.skin,this.onAllFliesCollected,this);
	    

	    for(var i in this.blueFlies){
	    	var fly = this.blueFlies[i];
	    	this.itzi.body.setBodyContactCallback(fly.skin,this.onBlueFileCollected,this);	
	    }

	    for(var i in this.goldFlies){
	    	var fly = this.goldFlies[i];
	    	this.itzi.body.setBodyContactCallback(fly.skin,this.onBlueFileCollected,this);	
	    }

	    for(var i in this.springPads){
	    	this.itzi.body.setBodyContactCallback(this.springPads[i],this.onItziOnSpringPad,this);
		}

		this.itzi.body.setBodyContactCallback(this.mainCog,this.onItziBoundryTouch,this);
	    
	}

	hideLevelObjects()
	{
		for(var i in this.rotatingElements){
			this.rotatingElements[i].visible = false;
		}
		this.itzi.destroy();
		this.itzi.visible = false;
		this.fireSprite.destroy();
		this.canvasObjects.visible = false;
	}

	startGame()
	{
		var game = this.game;
		if(global_config.panel_show){
			this.gameStartPanel.toggle(function(){
				this.isGameRunning = true;
				this.addLevelObjects();
		    	this.addCanvasObjects();
		    	game.onGameStart.dispatch(this.gameTimeLimit);
		    	this.cursor = this.input.keyboard.createCursorKeys();
			}.bind(this));
		}else{
			this.isGameRunning = true;
			this.addLevelObjects();
	    	this.addCanvasObjects();
	    	this.game.onGameStart.dispatch(this.gameTimeLimit);
	    	this.cursor = this.input.keyboard.createCursorKeys();
		}
	}

	startClockTick()
	{
		this.timeRemaining -= 1000;
		if(this.timeRemaining >= 0){
			this.game.onClockTick.dispatch(this.timeRemaining);
			setTimeout(this.startClockTick.bind(this),1000);
		}else{
			this.game.onGameEnd.dispatch(global_config.GameEndType.Times_UP);
		}
	}

	endGame(reason)
	{
		var game = this.game;
		this.cursor = null;
		this.hideLevelObjects();
		switch(reason){
			case global_config.GameEndType.Fly_Collected:
			break;
			case global_config.GameEndType.Itzy_fried:
				this.gameFailPanel.toggle(global_config.Language.level_failed_cause_damage);
			break;
			case global_config.GameEndType.Times_UP:
				this.gameFailPanel.toggle(global_config.Language.level_failed_cause_time);
			break;
		}
		this.canvasObjects.updateEnergy(0);
	}

	setupGame()
	{
		var game = this.game;
		game.stage.backgroundColor = '#000000';
		game.add.image(0,0,global_config.world);

	    // Enable Box2D physics
	    game.physics.startSystem(Phaser.Physics.BOX2D);
	    game.physics.box2d.gravity.y = 500;
	    game.physics.box2d.restitution = 0.1
	    game.physics.box2d.friction = 300;
	}

	render() 
	{
		 //this.game.debug.box2dWorld();
	}

	update()
	{
		if(!this.isGameRunning) return;
		
		if(this.cursor){
			var angularSpeed = 0;

			if (this.cursor.left.isDown) {
				angularSpeed += -1;
			}
			else if (this.cursor.right.isDown) {
				angularSpeed += +1;
			}

			var backupVel = this.itzi.body.velocity.x;
			this.itzi.body.velocity.x = backupVel + 0.0001;
			this.itzi.body.velocity.x = backupVel;

			for(var i in this.rotatingElements){
				this.rotatingElements[i].angle += angularSpeed;
			}
			this.smallCog.updateAngle(angularSpeed);
			this.mainCog.body.angle += angularSpeed;
			//this.itzi.angle = 0;//Math.max(Math.min(this.itzi.angle, 30), -30);
			this.canvasObjects.updateEnergy(this.itzi.health);

			
	    	//this.fireSprite.updateAngle(this.mainCog.body.angle);
	    	//this.fireSprite.angle +=1;
		}
	}

	addToRotatingElements(obj){
		var game = this.game;
		game.add.existing(obj);
		this.rotatingElements.push(obj);
	}

	// Level Objects
	addAngles(angles)
	{
		var game = this.game,
			interactiveColor = Utils.getRandomElement(global_config.AngleColors);
		for(var i in angles){
	    	var oAngle = angles[i],
	    		color = global_config.Config.angleDefaultColor,
	    		range = [];

	    	if(oAngle.interactive){
	    		this.oLines[oAngle.triggeredLine].updateLineTriggered(interactiveColor);
	    		color = interactiveColor;
	    	}

	    	var ang = new Angle(game,oAngle,this.oLines,color);
	    	this.addToRotatingElements(ang);
	    }
	}

	addAnnotationText(annotationText)
	{
		var game = this.game;
		for(var i in annotationText){
	    	var annotationText = new AnnotationText(game,annotationText[i]);
	    	this.addToRotatingElements(annotationText);
	    }
	}

	addBlueFlies(blueFlies)
	{
		var game = this.game,
			i = null,
			bFly = null,
			fly = null;
		for(i in blueFlies){
	    	bFly = blueFlies[i];
	    	fly = new BlueFly(game,bFly);
	    	this.blueFlies.push(fly);
	    	this.addToRotatingElements(fly);
	    }
	}

	addLevelShapes(levelShape)
	{
		var game = this.game;
		for(var i in levelShape){
	    	var levelShape = new LevelShape(game,levelShape[i]);
	    	this.addToRotatingElements(levelShape);
	    }
	}

	addGate(gate,blueFlyLength)
	{
		var game = this.game;
		this.gate = new Gate(game, gate, blueFlyLength);
	    this.addToRotatingElements(this.gate);
	}

	addGoldFlies(goldFlies)
	{
		var game = this.game;
		for(var i in goldFlies)
	    {
	    	var gFly = goldFlies[i],
	    		fly = new GoldFly(game,gFly);
	    	this.goldFlies.push(fly);
	    	this.addToRotatingElements(fly);
	    }
	}

	addHintPanel(hintImageID,hintTextID)
	{
		var game = this.game;
		if(hintImageID){
	    	var hintPanel = new HintPanel(game, hintImageID, hintTextID);
	    	game.add.existing(hintPanel);
	    }
	}

	addInfoCircle(infoCircle)
	{
		var game = this.game;
		for(var i in infoCircle){
	    	var infoCircle = new InfoCircle(game,infoCircle[i]);
	    	this.addToRotatingElements(infoCircle);
	    }
	}

	addItzi(cnfItzi)
	{
		var game = this.game;
		this.itzi = new Itzi(game,cnfItzi);
	    game.add.existing(this.itzi);
	}

	addLines(lines)
	{
		var game = this.game;
		for(var i in lines){
	    	var lineCnf = lines[i],
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
	    		case "crumbling":
	    			line = new CrumblingLine(game,lineCnf);
	    		break;
	    		default:
	    			line = new SimpleLine(game,lineCnf);
	    		break;
	    	}

	    	this.oLines[lineCnf.id] = line;
    		this.addToRotatingElements(line);

    		if(global_config.debug){
	    		var text = new DebugText(game, lineCnf, lineCnf.id);
    			this.addToRotatingElements(text);
	    	}
	    }
	}

	addSpikeBall(spikeBalls)
	{
		var game = this.game;
		for(var i in spikeBalls){
	    	var config = spikeBalls[i],
	    		spikeBall = new SpikeBall(game, config),
	    		spikeBallPath = new SpikeBallPath(game,config);

	    	this.rotatingElements.push(spikeBall.skin);
	    	this.addToRotatingElements(spikeBallPath);
	    	this.addToRotatingElements(spikeBall);
	    }
	}

	addSpringPad(springPads)
	{
		var game = this.game;
		for(var i in springPads){
	    	var config = springPads[i],
	    		springPad = new SpringPad(game, config);
	    	springPad.skin.sprite = springPad;
	    	this.springPads.push(springPad.skin);
	    	this.addToRotatingElements(springPad);
	    	this.rotatingElements.push(springPad.skin);
	    }
	}

	// Itzi Touch Events
	onItziOnSpringPad(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    body2.sprite.activate();
	}

	onBlueFileCollected(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    this.blueBeeCollected++;
	    this.canvasObjects.updateBeeCollected(this.blueBeeCollected,this.goldBeeCollected);
	    body2.sprite.destroy();
	    body2.destroy();
	    this.gate.collectFile();
	}

	onGoldFileCollected(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin)
	    {
	        return;
	    }
	    this.goldBeeCollected ++;
	    this.canvasObjects.updateBeeCollected(this.blueBeeCollected,this.goldBeeCollected);
	    body2.sprite.destroy();
	    body2.destroy();
	}

	onAllFliesCollected(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin){
	        return;
	    }

	    if(this.gate.isOpenable){
	    	this.game.onGameEnd.dispatch(global_config.GameEndType.Fly_Collected);
		    this.gate.skin.destroy();
		    //this.itzi.skin.destroy();
		    var tween1 = this.game.add.tween(this.itzi).to({
		    	x:this.gate.world.x,
		    	y:this.gate.world.y,
		    	rotation : "+10"
		    },1000, Phaser.Easing.Linear.NONE, false);
		    var tween2 = this.game.add.tween(this.itzi.scale).to({
		    	x:0,y:0},1000, Phaser.Easing.Linear.NONE, false);
		    this.gate.openGate();
		    tween1.onComplete.add(function(){
		    	this.hideLevelObjects();
		    },this);
		    tween1.start();
		    tween2.start();
	    }
	}

	onItziBoundryTouch(body1, body2, fixture1, fixture2, begin, contact,impulse)
	{
		if (!begin){
	        return;
	    }
	    var angle = Phaser.Math.angleBetweenPoints(new Phaser.Point(400,300),new Phaser.Point(
	    	this.itzi.x,this.itzi.y
	    	));
	    this.fireSprite.show(this.itzi.x,this.itzi.y,this.mainCog.angle);
	    this.itzi.updateHealth();

	}
}