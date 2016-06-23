class InteractiveTextBox extends Phaser.Sprite
{
	constructor(game,pos,color)
	{
		super(game,pos.x,pos.y);
		this.color = color;
		this.text = "";
		var graphics = new Phaser.Graphics(game,0,0),
			blinker = new Phaser.Graphics(game,0,0),
			style = {fill:Utils.getHashColor(color),font: "16px Arial"},
			width = 40,
			height = 20;
		graphics.clear();
		graphics.lineStyle(2, color);
		graphics.beginFill(0x000000);
		graphics.drawRect(0,0,width,height);
    	graphics.endFill();

    	blinker.clear();
    	blinker.beginFill(color);
		blinker.drawRect(width/2,2,2,height-4);
    	blinker.endFill();
    	
    	this.addChild(graphics);
    	this.addChild(blinker);
    	this.blinker = blinker;

		this.textLabel = new Phaser.Text(game,width/2,(height/2)+2,"",style);
		this.textLabel.anchor.set(0.5,0.5);
    	this.addChild(this.textLabel);

    	setInterval(function(){
    		if(this.visible){
    			if(this.text.length == 0){
    				this.blinker.visible = !this.blinker.visible;
    			}else{
    				this.blinker.visible = false;
    				this.textLabel.text = this.text;
    			}	
    		}
    	}.bind(this),500);
	}

	updateText(code)
	{
		var text = this.text,
			len = text.length;

		if(code == -1 && len >0){
			this.text = text.substring(0, len - 1);
		}else if(code != -1){
			this.text += code;
		}
		this.textLabel.text = this.text;
	}
}