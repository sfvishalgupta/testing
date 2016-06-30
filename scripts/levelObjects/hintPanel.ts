class HintPanel extends Phaser.Sprite
{
	constructor(game, imageId, textId){
		super(game,0,360,'hint_panel');
		var image = new Phaser.Image(game,10,25,imageId),
			style = {fill:'#000000',font: "bold 11px Arial"},
			text = new Phaser.Text(game,0,120,global_config.Language[textId],style);
		
		image.anchor.set(0.5,0);
		image.position.x = this.width/2;
		
		text.wordWrapWidth = this.width-30;
		text.wordWrap = true;
		text.align = "center";
		text.anchor.set(0.5,0);
		text.position.x = this.width/2;

		this.addChild(image);
		this.addChild(text);
	}
}