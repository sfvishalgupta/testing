class Gate extends Phaser.Sprite
{
	constructor(game,config,numFlies)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = config.x*global_config.scale,
			y = config.y*global_config.scale; 
		
		super(game,cx,cy);
		this.anchor.set(0.5,0.5);
    	this.pivot.x = -x;
    	this.pivot.y = -y;


    	var skin = new Phaser.Physics.Box2D.Body(game, null,cx, cy, 100);
    	skin.setCircle(30,x,y);
    	skin.static = true;
    	this.skin = skin;

    	this.gateTwirl = new Phaser.Sprite(game,0,0,'gateTwirl');
    	this.gateTwirl.animations.add('play');
    	this.gateTwirl.animations.play("play",30,true);
    	this.gateTwirl.anchor.set(0.5,0.5);
    	this.addChild(this.gateTwirl);

    	this.gate = new Phaser.Sprite(game,0,0,"gate",0);
    	this.gate.animations.add('play');
    	this.gate.anchor.set(0.5,0.5);
    	this.addChild(this.gate);
		this.isOpenable = false;
		if(numFlies>0){
			this.createGateLight(game,numFlies);
		}else{
			this.isOpenable = true;
			this.openGate();
		}
	}

	createGateLight(game, numFlies)
	{
		this.lights = [];
		this.collectedFlyCount = 0;
		for(var i=0;i<numFlies;i++){
			var light = new GateLight(game),
				angle = i/numFlies * Math.PI*2,
				r = 28,
				x = r*Math.cos(angle),
				y = r*Math.sin(angle);

			x = parseInt(x.toFixed(15));
			y = parseInt(y.toFixed(15));

			light.position.set(x,y);
			this.addChild(light);
			this.lights.push(light);
		}
	}

	openGate()
	{
		if(!this.isGateOpen){
			this.isGateOpen = true;
			this.gate.animations.play("play",5,false);
		}
	}

	collectFile()
	{
		this.collectedFlyCount++;
		for(var i =0;i<this.collectedFlyCount;i++){
			this.lights[i].openLight();
		}
		if(this.collectedFlyCount == this.lights.length){
			this.isOpenable = true;
			this.openGate();
		}
	}

	update()
	{
		this.skin.angle = this.angle;
	}
}

class GateLight extends Phaser.Sprite
{
	constructor(game)
	{
		super(game,0,0, "GateLight");
		this.maxFrame = 7;
		this.frame = this.maxFrame -1 ;
		this.anchor.set(0.5, 0.5);
	}

	openLight()
	{
		this.frame = this.maxFrame-2;
	}
}