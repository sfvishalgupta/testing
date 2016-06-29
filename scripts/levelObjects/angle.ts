class Angle extends Phaser.Sprite
{
	constructor(game,config,lines,color){
		var cx = game.world.centerX,
			cy = game.world.centerY;
		super(game,cx,cy);
		
		this.config = config;
		this.oLines = lines;
		this.color = color;
		this.game = game;
		this.name = config.id;
		this.angleValue = "50";
		this.triggeredLine = null;
		this._lineWidth = 2;
		this.isInterctive = this.config.interactive;
		if(this.config.triggeredLine){
			this.triggeredLine = lines[this.config.triggeredLine];
		}

		// Childrens
		this.graphics = null;
		this.textLabel = null;
		this.interactiveTextBox = null;
		this.graphicsButton = null;

		this.addGraphics();
	}

	update()
	{
		if(this.textLabel){
			this.textLabel.angle = -this.angle;
		}
		if(this.interactiveTextBox){
			this.interactiveTextBox.angle = -this.angle;	
		}
	}

	drawGraphics(startAngle,endAngle,radius)
	{
		var game = this.game;
		this.graphics = new Phaser.Graphics(game, 0, 0);
		this.graphics.clear();
		this.graphics.beginFill(this.color);

		for(var i=0;i<radius;i++){
			this.graphics.arc(0,0, i, startAngle,endAngle, false);
		}
		this.graphics.endFill(); 
		this.graphicsButton.addChild(this.graphics);
		this.graphicsButton.hitArea = this.graphics.getBounds();
	}

	addGraphics()
	{
		var oAngle = this.config,
			game = this.game,
			aLine1 = oAngle.lineA.split("."),
			aLine2 = oAngle.lineB.split("."),
			line1 = this.oLines[aLine1[0]],
			line2 = this.oLines[aLine2[0]],
			pt1 = line1.config[aLine1[1]],
			pt2 = line2.config[aLine2[1]],
			pts1 = new Phaser.Point(pt1.x,pt1.y),
			pts2 = new Phaser.Point(pt2.x,pt2.y),
			radius = oAngle.interactive ? 50 : 45,
			inter = Utils.getIntersactionPoint(line1,line2);

		if(inter != null){
			var from = Phaser.Point.subtract(pts1,inter),
				to = Phaser.Point.subtract(pts2,inter),
				startAngle = Phaser.Point.angle(from,new Phaser.Point()),
				endAngle = Phaser.Point.angle(to,new Phaser.Point());

			startAngle = startAngle < 0 ? 2*3.14 + startAngle : startAngle;
			endAngle = endAngle < 0 ? 2*3.14 + endAngle : endAngle;

			if(this.isInterctive){
				this.graphicsButton = new Phaser.Button(game,inter.x, inter.y);
				this.enableButton();
			}else{
				this.graphicsButton = new Phaser.Sprite(game,inter.x, inter.y);
			}
			this.addChild(this.graphicsButton);
			this.drawGraphics(startAngle, endAngle, radius);

			this.addLabel(startAngle,endAngle,inter);
			this.addTextBox();
		}
	}

	enableButton()
	{
		this.graphicsButton.inputEnabled = true;
		this.graphicsButton.input.useHandCursor = true;
		this.graphicsButton.onInputOver.add(function(){
			if(this.textLabel.visible){
				this.graphicsButton.alpha = 0.5;
			}
		}.bind(this));
		this.graphicsButton.onInputOut.add(function(){
			if(this.textLabel.visible){
				this.graphicsButton.alpha = 1;
			}
		}.bind(this));
		this.graphicsButton.onInputUp.add(function(){
			if(this.textLabel.visible){
				this.interactiveTextBox.visible = true;
				this.interactiveTextBox.text = this.textLabel.text;
				this.textLabel.visible = false;
			}else{
				this.interactiveTextBox.visible = false;
				this.textLabel.visible = true;
			}
		}.bind(this));
	}

	addLabel(a1,a2,inter)
	{
		var game = this.game,
			oAngle = this.config,
			style = {fill:'#FF0000',font: "bold 20px Arial"},
			pos = Utils.getRadialPosition(inter,a1,a2);

		this.textLabel = new Phaser.Text(game,pos.x,pos.y,this.angleValue,style);
		this.textLabel.anchor.set(0.5,0.5);
		this.addChild(this.textLabel);
		this.textBoxPos = pos;
	}

	addTextBox()
	{
		if(this.isInterctive){
			var pos = this.textBoxPos,
				game = this.game;
			this.interactiveTextBox = new InteractiveTextBox(this.game,pos,this.color);
			this.addChild(this.interactiveTextBox);
			this.interactiveTextBox.visible = false;

			game.input.keyboard.onDownCallback = function(e){
				if(this.interactiveTextBox.visible && e.which>47 && e.which < 58)
				{
					e.preventDefault();
					var codeValue = Utils.getKeycodeValue(e.which);
					this.dispatchKeyboardClick(codeValue);
				}else if(this.interactiveTextBox.visible && e.which == 8){
					e.preventDefault();
					this.dispatchKeyboardClick(-1);
				}else if(this.interactiveTextBox.visible && e.which == 13){
					e.preventDefault();
					this.interactiveTextBox.visible = false;
					this.textLabel.text = this.interactiveTextBox.text;
					this.textLabel.visible = true;
					this.graphicsButton.alpha = 1;
					this.game.onAngleEnterPress.dispatch(this.interactiveTextBox.text);
				}
    		}.bind(this);

    		game.onAngleEnterPress.add(function(e){
    			this.alpha = 0.5;
    			this.triggeredLine.alpha = 0.5;
				this.triggeredLine.skin.sensor = true;
    			setTimeout(function(){
    				this.alpha = 1;	
    				this.triggeredLine.alpha = 1;
					this.triggeredLine.skin.sensor = false;	
    			}.bind(this),global_config.Config.disableLineTime);
    		},this);
		}
	}

	dispatchKeyboardClick(code)
	{
		if(this.interactiveTextBox.visible)
		{
			this.interactiveTextBox.updateText(code);
		}
	}
}