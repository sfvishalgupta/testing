class BootState
{
	constructor()
	{

	}

	preload()
	{
		this.game.load.spritesheet('preloader-img','assets/MH_loading.png',120,140);
	}

	create()
	{
		var game = this.game,
			cx = game.world.centerX,
			cy = game.world.centerY;

		game.preloader = game.add.sprite(cx,cy,"preloader-img");
		game.preloader.anchor.set(0.5,0.5);
		game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles){
            var frame = Math.floor(progress/(100/7));
            if(frame != game.preloader.frame){
                   game.preloader.frame ++;
            }
            if(game.load.totalQueuedFiles() === 0){
                game.preloader.frame = 6;
                this.startPlay();
            }
        }, this);

		var build = "build/";
		game.load.json("level",build+"level.json");
		game.load.json("app",build+"app.json");
		
		// Level Objects
		game.load.image("conveyor",		"assets/level_object/conveyor.png");
		game.load.image("spike",		"assets/level_object/spike_textured.png");

		game.load.spritesheet("gate",		"assets/level_object/gate_texture.png",61, 62);
		game.load.spritesheet("GateLight",	"assets/level_object/gate_light.png",31, 32);
		game.load.spritesheet("GateLightAnim","assets/level_object/gate_light_anim.png",17, 17);
		game.load.spritesheet("gateTwirl",	"assets/level_object/gate_twirl_texture.png",52, 52);
		game.load.spritesheet('blueFly',	'assets/level_object/blue_fly.jpg', 53, 40);
		game.load.spritesheet('goldFly',	'assets/level_object/gold_fly.jpg', 53, 40);


		// Canvas Objects
		game.load.image("beeCounter",	"assets/counter-bee-bg.png");
		game.load.image("blueBee",		"assets/bee-counter-blue-only.png");
		game.load.image("cog",			"assets/cog-main.png");
		game.load.image("cog_small",	"assets/cog-small.png");
		game.load.image("colors",		"assets/colors.png");
		game.load.image("energy", 		"assets/health_bar_fill.png");
		game.load.image("goldBee",		"assets/bee-counter-yellow-only.png");
		game.load.image("healthBar",	"assets/health_bar_bg.png");
		game.load.image("itzi",			"assets/itzi.png");
		game.load.image("texture",		"assets/line_texture.jpg");
		game.load.image("timer",		"assets/timer.png");

		// Load backgrounds 
		game.load.image("world01",		"assets/backgrounds/world01.jpg");
		game.load.image("world02",		"assets/backgrounds/world02.jpg");
		game.load.image("world03",		"assets/backgrounds/world03.jpg");
		game.load.image("world04",		"assets/backgrounds/world04.jpg");
		game.load.image("world05",		"assets/backgrounds/world05.jpg");
		game.load.image("world06",		"assets/backgrounds/world06.jpg");

		game.load.start();
	}

	startPlay()
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
		this.game.onAngleEnterPress = new Phaser.Signal();
		this.game.state.add("Play", new PlayState(),true);
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

new Phaser.Game(800, 600, Phaser.CANVAS, 'container', new BootState());