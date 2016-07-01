class BootState extends Phaser.State
{
	constructor()
	{
		super();
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
		game.load.json("Language","locale/en-gb/language.json");
		
		// Level Objects
		game.load.image("conveyor",		"assets/level_object/conveyor.png");
		game.load.image("spike",		"assets/level_object/spike_textured.png");

		game.load.spritesheet("gate",					"assets/level_object/gate_texture.png",61, 62);
		game.load.spritesheet("GateLight",				"assets/level_object/gate_light.png",31, 32);
		game.load.spritesheet("GateLightAnim",			"assets/level_object/gate_light_anim.png",17, 17);
		game.load.spritesheet("gateTwirl",				"assets/level_object/gate_twirl_texture.png",52, 52);
		game.load.spritesheet('blueFly',				'assets/level_object/blue_fly.jpg', 53, 40);
		game.load.spritesheet('goldFly',				'assets/level_object/gold_fly.jpg', 53, 40);
		game.load.spritesheet('outerCircleParticle',	'assets/level_object/outercircle_particles.png', 77, 54);
		game.load.spritesheet('springPad',				'assets/level_object/spring_pad_textured.png', 67, 67);


		// Canvas Objects
		game.load.spritesheet("side_cog_gear","assets/side_cog.png",130,137);
		
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

		game.load.image("game_pause",		"assets/button-pause-up.png");
		game.load.image("game_pause_down",	"assets/button-pause-down.png");

		game.load.image("game_help",		"assets/button-help-up.png");
		game.load.image("game_help_down",	"assets/button-help-down.png");

		game.load.image("game_replay",		"assets/button-replay-up.png");
		game.load.image("game_replay_down",	"assets/button-replay-down.png");

		// Load backgrounds 
		game.load.image("menu",			"assets/backgrounds/menu.png");
		game.load.image("world01",		"assets/backgrounds/world01.jpg");
		game.load.image("world02",		"assets/backgrounds/world02.jpg");
		game.load.image("world03",		"assets/backgrounds/world03.jpg");
		game.load.image("world04",		"assets/backgrounds/world04.jpg");
		game.load.image("world05",		"assets/backgrounds/world05.jpg");
		game.load.image("world06",		"assets/backgrounds/world06.jpg");

		// Load Buttons
		game.load.image("btn_smallup",	"assets/buttons/button-small-up.png");
		
		// Menu Images
		game.load.image("clock_close", 		"assets/menu/clock-closed.png");
		game.load.image("clock_open", 		"assets/menu/clock-open.png");
		game.load.image("cog_chain", 		"assets/menu/cog-chain.png");
		game.load.image("cog_chain_long", 	"assets/menu/cog-chain_long.png");
		game.load.image("icon_clock", 		"assets/menu/icon-clock.png");
		game.load.image("icon_fly_blue", 	"assets/menu/icon-fly-blue.png");
		game.load.image("icon_fly_yellow", 	"assets/menu/icon-fly-yellow.png");
		game.load.image("icon_thunder", 	"assets/menu/icon-thunder.png");
		game.load.image("menu_down", 		"assets/menu/level-button-down.png");
		game.load.image("menu_lock", 		"assets/menu/level-button-lock.png");
		game.load.image("menu_panel", 		"assets/menu/game-panel-bg.png");
		game.load.image("menu_up", 			"assets/menu/level-button-up.png");
		game.load.image("over_pale_panel", 	"assets/menu/game-panel-game-over-pale-bg.png");
		game.load.image("start_pale_panel", "assets/menu/game-panel-start-of-level-pale-bg.png");
		game.load.image("title_chain", 		"assets/menu/title-screen-chain.png");
		
		game.load.spritesheet('top_banner' , 	"assets/menu/select-wood-panel-top.jpg", 521, 92);
		game.load.spritesheet('bottom_banner' , "assets/menu/select-wood-panel-bottom.jpg", 521, 71);


		//Hint Panel
		game.load.image("hint_panel", 		"assets/hint_panel.png");
		game.load.image("S1_L21_image",		"assets/hint/S1_L21_image.png");
		game.load.image("S3_L22_image",		"assets/hint/S3_L22_image.png");
		game.load.image("S4_L23_image",		"assets/hint/S4_L23_image.png");
		game.load.image("S5_L02_image",		"assets/hint/S5_L02_image.png");
		game.load.image("S5_L03_image",		"assets/hint/S5_L03_image.png");
		game.load.image("S5_L08_image",		"assets/hint/S5_L08_image.png");
		game.load.image("S5_L09_image",		"assets/hint/S5_L09_image.png");
		game.load.image("S5_L10_image",		"assets/hint/S5_L10_image.png");
		game.load.image("S5_L11_image",		"assets/hint/S5_L11_image.png");
		game.load.image("S5_L12_image",		"assets/hint/S5_L12_image.png");
		game.load.image("S5_L13_image",		"assets/hint/S5_L13_image.png");
		game.load.image("S5_L14_image",		"assets/hint/S5_L14_image.png");
		game.load.image("S5_L16_image",		"assets/hint/S5_L16_image.png");
		game.load.image("S5_L17_image",		"assets/hint/S5_L17_image.png");
		game.load.image("S5_L18_image",		"assets/hint/S5_L18_image.png");
		game.load.image("S5_L19_image",		"assets/hint/S5_L19_image.png");
		game.load.image("S5_L20_image",		"assets/hint/S5_L20_image.png");
		game.load.image("S5_L21_image",		"assets/hint/S5_L21_image.png");
		game.load.image("S5_L22_image",		"assets/hint/S5_L22_image.png");
		game.load.image("S5_L23_image",		"assets/hint/S5_L23_image.png");
		game.load.image("S5_L24_image",		"assets/hint/S5_L24_image.png");
		game.load.image("S6_L07_image",		"assets/hint/S6_L07_image.png");
		game.load.image("S6_L08_image",		"assets/hint/S6_L08_image.png");
		game.load.image("S6_L12_image",		"assets/hint/S6_L12_image.png");
		game.load.image("S6_L13_image",		"assets/hint/S6_L13_image.png");
		game.load.image("S6_L15_image",		"assets/hint/S6_L15_image.png");
		game.load.image("S6_L16_image",		"assets/hint/S6_L16_image.png");
		game.load.image("S6_L18_image",		"assets/hint/S6_L18_image.png");
		game.load.image("S6_L19_image",		"assets/hint/S6_L19_image.png");
		game.load.image("S6_L20_image",		"assets/hint/S6_L20_image.png");
		game.load.image("S6_L21_image",		"assets/hint/S6_L21_image.png");
		game.load.image("S6_L22_image",		"assets/hint/S6_L22_image.png");
		game.load.image("S6_L23_image",		"assets/hint/S6_L23_image.png");
		game.load.image("S6_L24_image",		"assets/hint/S6_L24_image.png");

		// Game Scripts
		//game.load.script('Utils',build+"utils.js");
		
		game.load.start();
	}

	startPlay()
	{
		var obj = Utils.getQueryParams(),
			level = Utils.getLevel(obj.level),
			stage = obj.stage || 1;

		global_config.stage = "S"+stage;
		global_config.level = "L"+level;
		global_config.world = "world0"+stage;
		
		if(typeof local_config != "undefined"){
			global_config = Utils.merge_objects(global_config,local_config);
		}
		
		global_config = Utils.merge_objects(global_config,this.game.cache.getJSON('app'));
		global_config = Utils.merge_objects(global_config, this.game.cache.getJSON('Language'));

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
		this.game.onGameStart 		= new Phaser.Signal();
		this.game.onGameEnd 		= new Phaser.Signal();
		this.game.onClockTick		= new Phaser.Signal();

		if(global_config.init_screen == 1){
			this.game.state.add("Menu", new MenuState(),true);
		}else if(global_config.init_screen == 2){
			this.game.state.add("Play", new PlayState(global_config.level,global_config.stage),true);
		}else if(global_config.init_screen == -1){
			this.game.state.add("Menu", new TestState(),true);
		}
	}
}

var global_config = {
	debug:false,
	init_screen : 1,
	panel_show : false
};

new Phaser.Game(800, 600, Phaser.CANVAS, 'container', new BootState());

//4 1 no angle shape
// animation on low energy