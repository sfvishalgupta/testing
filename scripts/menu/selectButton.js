var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SelectButton = (function (_super) {
    __extends(SelectButton, _super);
    function SelectButton(game, level) {
        var cnf = global_config.Images.MenuLock;
        _super.call(this, game, 0, 0, cnf.frame, cnf.frameName);
        this.game = game;
        this.myIndex = level;
        this.currentState = global_config.Objects.SelectBtn.State_Lock;
        this.onInputOver.add(this.onHover.bind(this));
        this.onInputOut.add(this.onOut.bind(this));
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.draw();
    }
    SelectButton.prototype.onOut = function () {
        if (this.currentState == global_config.Objects.SelectBtn.State_Open) {
            var cnf = global_config.Images.MenuDown;
            this.key = cnf.frame;
            this.frame = 0;
        }
    };
    SelectButton.prototype.onHover = function () {
        if (this.currentState == global_config.Objects.SelectBtn.State_Open) {
            var cnf = global_config.Images.MenuUp;
            this.key = cnf.frame;
            this.frame = 0;
        }
    };
    SelectButton.prototype.draw = function () {
        var game = this.game, style1 = { fill: '#cccccc', font: "bold 18px Arial" };
        this.labelText = new Phaser.Text(game, 32, 8, this.myIndex.substring(1), style1);
        this.addChild(this.labelText);
    };
    SelectButton.prototype.openBtn = function () {
        this.currentState = global_config.Objects.SelectBtn.State_Open;
        var cnf = global_config.Images.MenuDown;
        this.key = cnf.frame;
        this.frame = 0;
    };
    return SelectButton;
})(Phaser.Button);
var Phaser = Phaser || {}, global_config = global_config || {};
