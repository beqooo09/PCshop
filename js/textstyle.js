var particles = [],
    controllers = [],
    graphicsCords = [],
    texture,
    isReady = false,
    settings = {
      text: '3D MOTHERBOARD',
      textSize: 100,
      spaceBetween: 4,
      sizeMax: 4,
      speedMin: 0.01,
      speedMax: 0.075,
      opacityMin: 1,
      particleType: 'circle',
      color1: '#50514F',
      color2: '#F25F5C',
      color3: '#FFE066',
      color4: '#247BA0',
      color5: '#70C1B3',
      backgroundColor: '#EEEEEE'
    }; 

/**********************************************************************/
var gui = new dat.GUI();
var f1 = gui.addFolder('Settings');
controllers.push(f1.add(settings, 'text'));
controllers.push(f1.add(settings, 'textSize', 60, 400));
controllers.push(f1.add(settings, 'spaceBetween', 3, 20).step(1));
controllers.push(f1.add(settings, 'sizeMax', 3, 20).step(1));
controllers.push(f1.add(settings, 'speedMin', 0.01, 0.05).step(0.01));
controllers.push(f1.add(settings, 'speedMax', 0.05, 0.1).step(0.01));
controllers.push(f1.add(settings, 'opacityMin', 0.5, 1).step(0.01));

var f2 = gui.addFolder('Colors');
controllers.push(f2.addColor(settings, 'color1'));
controllers.push(f2.addColor(settings, 'color2'));
controllers.push(f2.addColor(settings, 'color3'));
controllers.push(f2.addColor(settings, 'color4'));
controllers.push(f2.addColor(settings, 'color5'));
controllers.push(f2.addColor(settings, 'backgroundColor'));

gui.close();

for (let i = 0; i < controllers.length; i++) {
  controllers[i].onChange(function() {
    for (var i = sprites.children.length - 1; i >= 0; i--) {
      sprites.removeChild(sprites.children[i]);
    };
    isReady = false;
  });
}
/**********************************************************************/

var app = new PIXI.Application(window.innerWidth, window.innerHeight, { antialias: true });
document.body.appendChild(app.view);

var sprites = new PIXI.ParticleContainer(30000, {
  scale: true,
  position: false,
  rotation: false,
  uvs: false,
  alpha: false
});
app.stage.addChild(sprites);

app.ticker.add(function() {
  if (!isReady) {
    setup();
  }

  for (var i = 0, len = particles.length; i < len; i++) {
    particles[i].update();
  }
});

function setup() {
  app.renderer.backgroundColor = settings.backgroundColor.replace('#', '0x');
  colors = [settings.color1, settings.color2, settings.color3, settings.color4, settings.color5];

  particles = [];
  graphicsCords = [];

  texture = createTexture();

  var text = new PIXI.Text(settings.text, {
    fontWeight: 'bold',
    fontSize: settings.textSize,
    fontFamily: 'Arial',
    fill: '#000000',
    align: 'center'
  });

  

  app.stage.addChild(text);

  var tmpCanvas = app.renderer.plugins.extract.canvas(app.stage);
  var imageData = tmpCanvas.getContext('2d').getImageData(0, 0, app.renderer.width, app.renderer.height);

  var widthDiff = (app.renderer.width - tmpCanvas.width) / 2;
  var heightDiff = (app.renderer.height - tmpCanvas.height) / 1;

  if (widthDiff < 0) {
    widthDiff = 0;
  }

  if (heightDiff < 0) {
    heightDiff = 0;
  }

  app.stage.removeChild(text);

  var tmpX = tmpY = colorIndex = tmpScale = tmpScaleMin = tmpScaleMax = tmpSpeed = 0, cords, t;
  for (var y = 0; y < tmpCanvas.height; y += settings.spaceBetween) {
    for (var x = 0; x < tmpCanvas.width; x += settings.spaceBetween) {
      if (imageData.data[((y * imageData.width + x) * 4) + 3] > 128) {
        particles.push(new Particle(x + widthDiff, y + heightDiff));
      }
    }
  }

  shuffle(particles);

  for (var i = 0, len = particles.length; i < len; i++) {
  	sprites.addChild(particles[i]);
  }

  isReady = true;
}

function createTexture() {
  var graphics = new PIXI.Graphics(),
      xCounter = 0,
      yCounter = 0,
      size = settings.sizeMax,
      colorTmp,
      spacer = 2;

  for (var i = 0, len = colors.length; i < len; i++) {
    xOffset = xCounter * (size * 2) + size + (xCounter * spacer);
    yOffset = yCounter * (size * 2) + size + (yCounter * spacer);

    colorTmp = colors[i].replace('#', '0x');

    graphics.beginFill(colorTmp);
    graphics.drawCircle(xOffset, yOffset, size, size);
    graphics.endFill();

    graphicsCords.push({ x: xOffset - size, y: yOffset - size });

    if (xOffset >= app.renderer.width - (size * 2) - size) {
      xCounter = 0;
      yCounter++;
    } else {
      xCounter++;
    }
  }

  return graphics.generateTexture();
}

function Particle(x, y) {
  this.scaleMin = getRandom(0.1, 0.25);
  this.scaleMax = getRandom(0.75, 1);
  this.baseScale = getRandom(this.scaleMin, this.scaleMax);
  this.velocity = getRandom(settings.speedMin, settings.speedMax);
  this.speed = 0;

  var cords = graphicsCords[getRandomInt(0, colors.length - 1)];
  var t = new PIXI.Texture(texture.baseTexture, new PIXI.math.Rectangle(cords.x, cords.y, settings.sizeMax * 2, settings.sizeMax * 2));

  PIXI.Sprite.call(this, t);

  this.position.x = x;
  this.position.y = y;
  this.anchor.x = this.anchor.y = 0.5;
  this.scale.x = this.scale.y = this.baseScale;
  this.alpha = getRandom(settings.opacityMin, 1);
}

Particle.prototype = Object.create(PIXI.Sprite.prototype);

Particle.prototype.update = function() {
  this.baseScale = Math.abs(Math.sin(this.speed)) + this.scaleMin;
  this.scale.x = this.scale.y = this.baseScale;
  this.speed += this.velocity;
}

/**********************************************************************/

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

/**********************************************************************/

window.onload = function() {
  if (mobilecheck()) {
    var colorInputs = document.querySelectorAll(".color input");
    
    for (var i = 0, len = colorInputs.length; i < len; i++) {
      colorInputs[i].setAttribute('readonly', 'true');
    }
  }
}

mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};