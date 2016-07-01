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
	    game.onGameStart.add(function(timeLimit){
	    	this.timeRemaining = timeLimit;
	    	this.startClockTick();
	    },this);
	    
	    game.onGameEnd.add(function(){
	    	this.cursor = null;
	    },this);

	    if(global_config.panel_show){
	    	this.gameStartPanel.toggle();
	    }else{
	    	this.startGame();
	    }
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
		this.game.physics.box2d.restitution = 1.5;
	    this.game.physics.box2d.friction = 100;
		
		this.smallCog = new SideCog(this.game);
		this.game.add.existing(this.smallCog);
		
		var game = this.game,
			cx = game.world.centerX,
	    	cy = game.world.centerY,
	    	polygonPoints = [],
	    	theta = 0,
			cog_circle = new Phaser.Physics.Box2D.Body(game, null, cx, cy, 100),
			cog = game.add.sprite(cx,cy,"cog"),
			radius = (cog.width/2) - 25;
		var delta = 2 * Math.PI / 80;
		var i = 0;
		for (theta = 0; theta <= 2 * Math.PI; theta += delta) 
		{
			var newTheta = theta + 0.2,
				radius1 = radius-10,
        		angle1 = newTheta + delta/2;
        	polygonPoints.push((radius * Math.cos(newTheta)));
        	polygonPoints.push((radius * Math.sin(newTheta)));
        	
        	polygonPoints.push((radius1 * Math.cos(angle1)));
        	polygonPoints.push((radius1 * Math.sin(angle1)));
        }

		cog.anchor.set(0.5,0.5);
		cog_circle.setChain(polygonPoints);
		this.rotatingElements.push(cog);
		this.rotatingElements.push(cog_circle);
		this.cog_circle = cog_circle;
	}

	addGamePanels()
	{
		var game = this.game;

		this.gameFailPanel = new GameFail(game,0,300);
		game.add.existing(this.gameFailPanel);

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
		
		game.physics.box2d.gravity.y = 500;
	    game.physics.box2d.restitution = 0.1
	    game.physics.box2d.friction = 300;

		// Objects
		this.addItzi(level.itzi);
		this.addLines(level.lines);
		this.addAngles(level.angles);
		this.addLevelShapes(level.levelShape);
		this.addInfoCircle(level.infoCircle);
		this.addAnnotationText(level.annotationText);
	    this.addGate(level.gate,blueFlyLength);
	    this.addBlueFlies(level.blueFlies);
	    this.addGoldFlies(level.goldFlies);
	    this.addSpikeBall(level.spikeBall);
	    this.addSpringPad(level.springPad);
	    this.addHintPanel(level.hintImageID,level.hintTextID)

	    this.itzi.skin.setBodyContactCallback(this.gate.skin,this.onAllFliesCollected,this);
	}

	hideLevelObjects()
	{
		for(var i in this.rotatingElements){
			this.rotatingElements[i].visible = false;
		}
		this.gameFailPanel.toggle();
	}

	startGame()
	{
		if(global_config.panel_show){
			this.gameStartPanel.toggle(function(){
				this.isGameRunning = true;
				this.addLevelObjects();
		    	this.addCanvasObjects();
		    	this.game.onGameStart.dispatch(this.gameTimeLimit);
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
		this.game.onClockTick.dispatch(this.timeRemaining);
		if(this.timeRemaining > 1){
			setTimeout(this.startClockTick.bind(this),1000);
		}else{
			this.endGame();
		}
	}

	endGame()
	{
		this.timeRemaining = -1;
		this.game.onGameEnd.dispatch();
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

	loadMenuScreen()
	{
		this.game.state.add("Menu", new MenuState(),true);
		//window.location.reload();
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

			var backupVel = this.itzi.skin.velocity.x;
			this.itzi.skin.velocity.x = backupVel + 0.0001;
			this.itzi.skin.velocity.x = backupVel;

			for(var i in this.rotatingElements){
				this.rotatingElements[i].angle += angularSpeed;
			}
			this.smallCog.updateAngle(angularSpeed);
			//this.itzi.angle = Math.max(Math.min(this.itzi.angle, 30), -30);
			this.canvasObjects.updateEnergy(this.itzi.health);
		}
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
	    	game.add.existing(ang);
    		this.rotatingElements.push(ang);
	    }
	}

	addAnnotationText(annotationText)
	{
		var game = this.game;
		for(var i in annotationText){
	    	var annotationText = new AnnotationText(game,annotationText[i]);
	    	game.add.existing(annotationText);
	    	this.rotatingElements.push(annotationText);
	    }
	}

	addBlueFlies(blueFlies)
	{
		var game = this.game;
		for(var i in blueFlies)
	    {
	    	var bFly = blueFlies[i],
	    		fly = new BlueFly(game,bFly);
	    	this.blueFlies.push(fly);
	    	game.add.existing(fly);
	    	this.rotatingElements.push(fly);
	    	this.itzi.skin.setBodyContactCallback(fly.skin,this.onBlueFileCollected,this);
	    }
	}

	addLevelShapes(levelShape)
	{
		var game = this.game;
		for(var i in levelShape){
	    	var levelShape = new LevelShape(game,levelShape[i]);
	    	game.add.existing(levelShape);
	    	this.rotatingElements.push(levelShape);
	    }
	}

	addGate(gate,blueFlyLength)
	{
		var game = this.game;
		this.gate = new Gate(game, gate, blueFlyLength);
	    game.add.existing(this.gate);
	    this.rotatingElements.push(this.gate);
	}

	addGoldFlies(goldFlies)
	{
		var game = this.game;
		for(var i in goldFlies)
	    {
	    	var gFly = goldFlies[i],
	    		fly = new GoldFly(game,gFly);
	    	this.goldFlies.push(fly);
	    	game.add.existing(fly);
	    	this.rotatingElements.push(fly);
	    	this.itzi.skin.setBodyContactCallback(fly.skin,this.onGoldFileCollected,this);
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
	    	game.add.existing(infoCircle);
	    	this.rotatingElements.push(infoCircle);
	    }
	}

	addItzi(itzi)
	{
		var game = this.game;
		this.itzi = new Itzi(game,itzi);
	    game.add.existing(this.itzi);

	    this.itzi.skin.setBodyContactCallback(this.cog_circle,this.onItziBoundryTouch,this);
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
	    	game.add.existing(line);
    		this.rotatingElements.push(line);

    		if(global_config.debug){
	    		var text = new DebugText(game, lineCnf, lineCnf.id);
    			game.add.existing(text);
    			this.rotatingElements.push(text);
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

	    	game.add.existing(spikeBallPath);
	    	game.add.existing(spikeBall);
	    	this.rotatingElements.push(spikeBall);
	    	this.rotatingElements.push(spikeBall.skin);
	    	this.rotatingElements.push(spikeBallPath);
	    }
	}

	addSpringPad(springPads)
	{
		var game = this.game;
		for(var i in springPads){
	    	var config = springPads[i],
	    		springPad = new SpringPad(game, config);
	    	game.add.existing(springPad);
	    	this.rotatingElements.push(springPad);
	    	this.rotatingElements.push(springPad.skin);
	    	springPad.skin.sprite = springPad;
	    	this.itzi.skin.setBodyContactCallback(springPad.skin,this.onItziOnSpringPad,this);
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
	    	this.endGame();
		    this.gate.skin.destroy();
		    this.itzi.skin.destroy();
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

	onItziBoundryTouch(body1, body2, fixture1, fixture2, begin)
	{
		if (!begin){
	        return;
	    }
	    this.itzi.playOuterCircleTouch();
	}
}