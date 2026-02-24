const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

let seed = random.getRandomSeed();
//seed = '532302';
random.setSeed(seed);
console.log('seed: ' + seed);

const settings = {
  //pixelRatio: 2, // Zoom x2
  //dimensions: [ 5120, 9102 ],
  dimensions: [ 5120, 5120 ],
  pixelsPerInch: 300,
  name: seed,
};

const colorschemes = {
  // Misc
  //technicolor: [ '0, 0, 0', '0, 0, 255', '255, 0, 0' ],
  // Generative Pointillism
  radioaxiom: [ '42, 42, 42', '41, 113, 56', '65, 166, 87', '181, 233, 181' ],
  amaranthblue: [ '42, 42, 42', '40, 112, 111', '65, 166, 164', '181, 232, 223' ],
  midnightblues: [ '42, 42, 42', '40, 91, 112', '65, 135, 166', '181, 217, 232' ],
  inkonfingertips: [ '42, 42, 42', '64, 40, 112', '98, 65, 166', '183, 183, 183' ],
  shallowwaters: [ '42, 42, 42', '58, 61, 64', '88, 91, 96', '221, 232, 181' ],
  shallowwatersaxiom: [ '42, 42, 42', '58, 61, 64', '88, 91, 96', '181, 233, 181' ],
  shallowwatersblues: [ '42, 42, 42', '58, 61, 64', '88, 91, 96', '181, 217, 232' ],
  shallowwatersroyal: [ '42, 42, 42', '58, 61, 64', '88, 91, 96', '181, 185, 232' ],
  poppyseed: [ '42, 42, 42', '168, 45, 40', '188, 75, 70', '207, 208, 209' ],
  silverhand: [ '42, 42, 42', '58, 61, 64', '88, 91, 96', '207, 208, 209' ],
  // Virgin Suicides Accents
  virginsuicides_accents_1: [ '42, 42, 42', '53, 44, 231', '231, 224, 44', '231, 119, 44', '231, 79, 44' ], // Repeat to increase chances to be sellected
  virginsuicides_accents_2: [ '42, 42, 42', '53, 44, 231', '231, 224, 44', '231, 119, 44', '231, 79, 44' ], 
  virginsuicides_accents_3: [ '42, 42, 42', '53, 44, 231', '231, 224, 44', '231, 119, 44', '231, 79, 44' ],
  virginsuicides_accents_4: [ '42, 42, 42', '53, 44, 231', '231, 224, 44', '231, 119, 44', '231, 79, 44' ],
  virginsuicides_accents_5: [ '42, 42, 42', '53, 44, 231', '231, 224, 44', '231, 119, 44', '231, 79, 44' ],
  virginsuicides_accents_violet: [ '42, 42, 42', '122, 61, 127', '156, 118, 154', '172, 164, 157' ],
};

function randomColor(colors) {
  return colors[Math.floor(random.range(0, 1) * colors.length)];
};

function selectColor() {

  const colorkeys = Object.keys(colorschemes);
  let color, color_random_key, canvas_color;
  let background_color;
  let symbol_color, accent_color;
  let worm_segment_color, worm_segment_border_color, sand_color;
  
  color_random_key = colorkeys[Math.floor(random.range(0, 1) * (colorkeys.length))];
  color = colorschemes[color_random_key];

  let canvas_color_change_chance = random.chance(0.25);
  if (canvas_color_change_chance === true) {
    canvas_color = `rgba(${randomColor(color)}, 0.6)`;
  } else {
    canvas_color = 'rgba(248, 245, 245)';
  }
  //console.log('canvas color: ' + canvas_color);
  
  symbol_color = `rgba(${randomColor(color)}, 0.6)`;
  worm_segment_color = `rgba(${randomColor(color)}, 0.8)`;
  worm_segment_border_color = `rgba(${randomColor(color)}, 0.8)`;
  sand_color = `rgba(${randomColor(color)}, 0.65)`;

  while (worm_segment_color === worm_segment_border_color) {
    console.log('border and segment colors are same, re-roll');
    worm_segment_color = `rgba(${randomColor(color)}, 1)`;
    worm_segment_border_color = `rgba(${randomColor(color)}, 1)`;
  }

  while (worm_segment_color === worm_segment_border_color && worm_segment_color === sand_color) {
    console.log('colors all same, re-roll');
    worm_segment_color = `rgba(${randomColor(color)}, 1)`;
    worm_segment_border_color = `rgba(${randomColor(color)}, 1)`;
    sand_color = `rgba(${randomColor(color)}, 1)`;
  }

  background_color = sand_color;

  let accent_colorscheme = colorschemes['virginsuicides_accents_1'];
  accent_color = `rgba(${randomColor(accent_colorscheme)}, 1)`;

  console.log('colorset: ' + color_random_key);
  //console.log('canvas: ' + canvas_color);
  //console.log('segment: ' + color);
  //console.log('border: ' + color);
  //console.log('sand: ' + color);
  //console.log('symbol: ' + symbol_color);
  //console.log('accent: ' + accent_color);

  return { canvas_color, symbol_color, accent_color, worm_segment_color, worm_segment_border_color, sand_color, background_color } 

};


const sketch = ({ context, width, height }) => {
// const sketch start

  let worm_start_x, worm_start_y, worm_segment_radius;
  let sand_size, sand_dencity;

  let colors_primary = selectColor();
  let canvas_color = colors_primary.canvas_color,
      symbol_color = colors_primary.symbol_color,
      accent_color = colors_primary.accent_color,
      worm_segment_color = colors_primary.worm_segment_color,
      worm_segment_border_color = colors_primary.worm_segment_border_color,
      sand_color = colors_primary.sand_color,
      background_color = colors_primary.background_color;

  // Worms 1
    const worms_primary = [];

      for(let number_of_worms = 1; number_of_worms <= random.range(2, 6).toFixed(); number_of_worms++) {
        //let worm = number_of_worms.toString();
        worm_segment_radius = random.range(120, 340).toFixed(); // Default: 120, 340
        worm_start_x = random.range(0, width + (worm_segment_radius * 2));
        worm_start_y = random.range(0, height + (worm_segment_radius * 2));
        if (worm_segment_radius <= 140) {  // Increasing a chance of having big particles in smaller segments
          if (random.chance(0.75) === true) {
            sand_size = random.range(40, 50);
          } else {
            sand_size = random.range(0, 40);
          };
        } else {
          sand_size = random.range(0, 50); // Default: 0, 50
        };
        //console.log(sand_size);
        sand_dencity = random.range(0, 50); // Default: 0, 50
        // segment x, y, color, border color, radius; sand color, size, density
        let worm = new WormSegment(worm_start_x,
                                  worm_start_y,
                                  worm_segment_color,
                                  worm_segment_border_color,
                                  worm_segment_radius,
                                  sand_color,
                                  sand_size,
                                  sand_dencity);
        worms_primary.push(worm);
        //console.log(worm);
      };
      console.log('number of worms: ' + worms_primary.length);
  // End

  // Worms 2
    let colors_secondary = selectColor();
        worm_segment_color = colors_secondary.worm_segment_color,
        worm_segment_border_color = colors_secondary.worm_segment_border_color,
        sand_color = colors_secondary.sand_color;

    const worms_secondary = [];

      for(number_of_worms = 1; number_of_worms <= random.range(0, 3).toFixed(); number_of_worms++) {
        //let worm = number_of_worms.toString();
        worm_segment_radius = random.range(180, 360).toFixed(); // Default: 100, 300
        worm_start_x = random.range(0, width + (worm_segment_radius * 2));
        worm_start_y = random.range(0, height + (worm_segment_radius * 2));
        sand_size = random.range(0, 60); // Default: 0, 50
        sand_dencity = random.range(0, 50); // Default: 0, 50
        // segment x, y, color, border color, radius; sand color, size, density
        worm = new WormSegment(worm_start_x,
                              worm_start_y,
                              worm_segment_color,
                              worm_segment_border_color,
                              worm_segment_radius,
                              sand_color,
                              sand_size,
                              sand_dencity);
        worms_secondary.push(worm);
        //console.log(worm);
      };
      console.log('number of worms: ' + worms_secondary.length);
  // End

  // Symbols
    const symbols = [];

      const cells_w_symbols = random.pick([16, 24, 30]); // 16, 24, 30
      console.log('cells w/ symbols: ' + cells_w_symbols);
      const symbol_cell_size = width / cells_w_symbols; // A cell's width & height
      
      for (let symb_i = symbol_cell_size; symb_i < width - symbol_cell_size; symb_i += symbol_cell_size) {
        for (let symb_j = symbol_cell_size; symb_j < height - symbol_cell_size * 2; symb_j += symbol_cell_size) { // "* 2" is needed to cut off the last horizontal line
          //x, y, width, height, color
          symbols.push(new Symbols(symb_i, symb_j, symbol_cell_size, symbol_cell_size, symbol_color));
        }
      };
  // End

  // Symbols Accent
    const symbols_acccent = [];
      
      for (symb_i = symbol_cell_size; symb_i < width - symbol_cell_size; symb_i += symbol_cell_size) {
        for (symb_j = symbol_cell_size; symb_j < height - symbol_cell_size * 2; symb_j += symbol_cell_size) { // "* 2" is needed to cut off the last horizontal line
          //x, y, width, height, color
          symbols_acccent.push(new Symbols(symb_i, symb_j, symbol_cell_size, symbol_cell_size, accent_color));
        }
      };
  // End

  // Background Pattern Primary
    const background_primary = [];

      let cells_w_background = random.pick([10, 12, 16, 20, 24, 30]); // 10, 12, 16, 20, 24, 30
      console.log('background pattern primary: ' + (cells_w_background - 2));
      let backround_cells = width / cells_w_background;

      let stroke, offset, offsetx, offsety;
      
      // Destroy background
      let destroyx = random.chance(0.75); // Default 0.5
      let destroyy = random.chance(0.75); // Default 0.5
      console.log('pattern destroy probability: ' + destroyx + ', ' + destroyy);
      if (destroyx === true && destroyy !== true) {
        destroyx = 1;
        destroyy = 0;
        console.log('destroy x: ' + destroyx + ' (yes)');
        console.log('destroy y: ' + destroyy + ' (no)');
      } else if (destroyy === true && destroyx !== true) {
        destroyx = 0;
        destroyy = 1;
        console.log('destroy x: ' + destroyx + ' (no)');
        console.log('destroy y: ' + destroyy + ' (yes)');
      } else {
        destroyx = 0;
        destroyy = 0;
        console.log('destroy x: ' + destroyx + ' (no)');
        console.log('destroy y: ' + destroyy + ' (no)');
      };

      stroke = false;
      offset = random.boolean();
      //console.log('background primary offset: ' + offset);
      for (let bgi = backround_cells; bgi < width - backround_cells; bgi += backround_cells) {
        for (let bgj = backround_cells; bgj < height - backround_cells * 2; bgj += backround_cells) {
          // x, y, width, height, radius, color, density, destroyx, destroyy, offset, offsetx, offsety, stroke
          let destroy_offset = random.range(-1, 1);
          background_primary.push(new Background(
                                      bgi,
                                      bgj * random.range(-1, 1),
                                    (backround_cells * destroy_offset) + (backround_cells * destroy_offset) * 2,
                                      backround_cells * random.range(-10, 10),
                                      random.range(0, 10),
                                      background_color,
                                      random.range(100, 200),
                                      destroyx,
                                      destroyy,
                                      offset,
                                      offsetx,
                                      offsety,
                                      stroke));
          offsetx = random.range(-0.5, 1);
          offsety = random.range(-8, 8);
          background_primary.push(new Background(
                                      bgi,
                                      bgj,
                                      backround_cells * offsetx,
                                      backround_cells * offsety,
                                      random.range(0, 10),
                                      background_color,
                                      random.range(40, 60),
                                      destroyx,
                                      destroyy,
                                      offset,
                                      offsetx,
                                      offsety,
                                      stroke));
        }
      };

  // Bakground Pattern Secondary
    const background_secondary = [];

      cells_w_background = random.pick([10, 12, 16, 20, 24, 30]); // 10, 12, 16, 20, 24, 30
      console.log('background pattern secondary: ' + (cells_w_background - 2));
      backround_cells = width / cells_w_background;

      stroke = true;
      offset = true;
      //console.log('background secondary offset: ' + offset);
      for (bgi = backround_cells; bgi < width - backround_cells; bgi += backround_cells) {
        for (bgj = backround_cells; bgj < height - backround_cells; bgj += backround_cells) {
          // x, y, width, height, radius, color, density, destroyx, destroyy, stroke, pattern offset correction x, pattern offset correction y
          offsetx = random.range(-0.5, 2);
          offsety = random.range(-8, 8);
          background_secondary.push(new Background(
                                        bgi,
                                        bgj,
                                        backround_cells * offsetx,
                                        backround_cells * offsety,
                                        random.range(0, 10),
                                        background_color,
                                        random.range(40, 60),
                                        destroyx,
                                        destroyy,
                                        offset,
                                        offsetx,
                                        offsety,
                                        stroke));
        }
      };
  // End

  // Frame
  // x, y, width, height, gutter, color
  const frame = new Frame(0, 0, width, height, backround_cells, accent_color);

  
  // End

  return {
  // start return

    begin () {

      // Avoid accidental background transparency
      context.fillStyle = 'rgba(248, 245, 245)';
      context.fillRect(0, 0, width, height);
      
      // Canvas color (can have transparency)
      context.fillStyle = canvas_color;
      context.fillRect(0, 0, width, height);
      
    },
    
    tick ({ context }) {
    // tick start

      let rotate_amplitude;

      // Background Secondary
      if (random.chance(0.85) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        if (offset === true) {
          centerGrid(context, backround_cells, backround_cells, offsetx, offsety);
        }
        background_secondary.forEach(pattern => {
          pattern.draw(context, width, height);
          rotateCanvas(context, 0.75, rotate_amplitude);
        });
        context.restore();
        console.log('background secondary: true');
      } else {
        console.log('background secondary: false');
      };

      // Worm Primary
      if (random.chance(1) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        worms_primary.forEach(worm => {
          let worm_max_lenght = random.range(2000, 4000).toFixed();
          for (let worm_lenght = 1; worm_lenght <= worm_max_lenght; worm_lenght++ ) {
            
            worm.draw(context);
            worm.move(context);
            worm.bounce(width, height);
            
            rotateCanvas(context, 0.25, rotate_amplitude);
            
          }
          //console.log('primary worm lenght: ' + worm_max_lenght);
        });
        context.restore();
        console.log('worm secondary: true');
      } else {
        console.log('worm secondary: false');
      };

      // Background Primary
      if (random.chance(0.5) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        background_primary.forEach(pattern => {
          pattern.draw(context, width, height);
          rotateCanvas(context, 0.75, rotate_amplitude);
        });
        context.restore();
        console.log('background primary: true');
      } else {
        console.log('background primary: false');
      };

      // Frame
      if (random.chance(1) === true) {
        frame.draw(context);
        console.log('frame: true');
      } else {
        console.log('frame: false');
      };

      // Worm Secondary
      if (random.chance(0.85) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        worms_secondary.forEach(worm => {
          let worm_max_lenght = random.range(1500, 3000).toFixed();
          for (let worm_lenght = 1; worm_lenght <= worm_max_lenght; worm_lenght++ ) {
            
            worm.draw(context);
            worm.move(context);
            worm.bounce(width, height);

            rotateCanvas(context, 0.75, rotate_amplitude);
            
          }
          //console.log('primary worm lenght: ' + worm_max_lenght);
        });
        context.restore();
        console.log('worm secondary: true');
      } else {
        console.log('worm secondary: false');
      };

      // Symbols
      if (random.chance(0.5) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        symbols.forEach(symbol => {
          symbol.draw(context);
          rotateCanvas(context, 0.75, rotate_amplitude);
        });
        context.restore();
        console.log('symbols: true');
      } else {
        console.log('symbols: false');
      };

      // Symbols Accent
      if (random.chance(0.65) === true) {
        context.save();
        rotate_amplitude = rotateCanvasAmplitude();
        symbols_acccent.forEach(symbol => {
          symbol.draw(context);
          rotateCanvas(context, 0.05, rotate_amplitude);
        });
        context.restore();
        console.log('symbols accent: true');
      } else {
        console.log('symbols accent: false');
      };

      /*
      // Seed phrase display
      context.save();
        context.translate(400, 500);
        context.font = "256px 'Andale Mono'";
        context.fillStyle = 'red';
        context.fillText(seed, 0, 0);
      context.restore();
      */
      
    // tick end
    },

  // return end
  };

// const sketch end
};

canvasSketch(sketch, settings);


// Worms
class WormSegmentDirection {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  };
};
class WormSegmentProperties {
  constructor(segment_color, segment_border_color, segment_radius) {
    this.segment_color = segment_color;
    this.segment_border_color = segment_border_color;
    this.segment_radius = segment_radius;
  }
};
class SandParticleProperties {
  constructor(sand_color, sand_size, sand_density) {
    this.sand_color = sand_color;
    this.sand_size = sand_size;
    this.sand_density = sand_density;
  }
};
class WormSegment {
  constructor(x, y, segment_color, segment_border_color, segment_radius, sand_color, sand_size, sand_density) {
    this.step = new WormSegmentDirection(x, y);
    this.worm = new WormSegmentProperties(segment_color, segment_border_color, segment_radius);
    this.sand = new SandParticleProperties(sand_color, sand_size, sand_density);
    this.segment_radius = Math.floor(this.worm.segment_radius);
  };
  draw(context) {

    context.save();

      context.translate(this.step.x + this.segment_radius, this.step.y + this.segment_radius);
      
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = this.worm.segment_color;
      context.fillStyle = this.worm.segment_border_color;
      context.arc(0, 0, this.segment_radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.closePath();
      context.clip();
      
      this.fill_circles(context);
      this.fill_circles_empty(context);

    context.restore();

  };
  move() {

    /*
    // Original version with random coordinate wobbling
    let movex = random.range(-random.range(100, 140), random.range(100, 140));
    let movey = random.range(-random.range(100, 140), random.range(100, 140));

    this.step.x += movex;
    this.step.y += movey;
    */

    let movex = random.noise3D(-random.range(100, 140), random.range(100, 140), random.range(100, 140), 0.3, 90);
    let movey = random.noise3D(-random.range(100, 140), random.range(100, 140), random.range(100, 140), 0.3, 90);

    this.step.x += movex;
    this.step.y += movey;

  };
  bounce(width, height) {

    /*
    // Bounce by segment centre reaching the box borders
    if (this.step.x < 0) this.step.x = 0;
    if (this.step.x > width - (this.segment_radius * 2)) this.step.x = width - (this.segment_radius * 2);
    if (this.step.y < 0) this.step.y = 0;
    if (this.step.y > height - (this.segment_radius * 2)) this.step.y = height - (this.segment_radius * 2);
    */

    // Bounce shifted behind the box borders
    if (this.step.x < 0) this.step.x = -(this.segment_radius / 5);
    if (this.step.x > width - this.segment_radius) this.step.x = width - this.segment_radius;
    if (this.step.y < 0) this.step.y = -(this.segment_radius / 5);
    if (this.step.y > height - this.segment_radius) this.step.y = height - this.segment_radius;

  };
  fill_circles(context) {
    
    context.save();

    //context.translate(this.step.x + this.radius * 1, this.step.y + this.radius * 1); --> we don't need this since we "translate" in class WormSegment > draw(context) {...

    let variable_density = random.range(0, this.sand.sand_density)
    for (let i = 0; i < variable_density; i++) {
      context.beginPath();
      context.arc(random.range(-this.segment_radius, this.segment_radius), random.range(-this.segment_radius, this.segment_radius), this.sand.sand_size, Math.PI * 2, 0);
      context.fillStyle = this.sand.sand_color;
      context.fill();
      context.closePath();
    }

    context.restore();

  };
  fill_circles_empty(context) {
    
    context.save();

    const variable_size = random.pick([0, 2, 10]);
    const object_size = this.segment_radius / variable_size; // A cell's width & height

    context.beginPath();
    context.lineWidth = 8;
    context.arc(random.range(-this.segment_radius, this.segment_radius), random.range(-this.segment_radius, this.segment_radius), object_size, Math.PI * 2, 0);
    context.strokeStyle = this.sand.sand_color;
    context.stroke();
    context.closePath();
  
    context.restore();
  
  };
};


// Symbols
class SymbolsProperties {
  constructor(x, y, cell_width, cell_height, symbol_color) {
    this.x = x;
    this.y = y;
    this.cell_width = cell_width;
    this.cell_height = cell_height;
    this.symbol_color = symbol_color;
  };
};
class Symbols {
  constructor(x, y, cell_width, cell_height, symbol_color) {
    this.param = new SymbolsProperties(x, y, cell_width, cell_height, symbol_color);
  };
  draw(context) {

    context.save();

      // Cell grid
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = this.param.symbol_color;
      context.rect(this.param.x, this.param.y, this.param.cell_width, this.param.cell_height);
      //context.stroke(); // Comment to switch off grid
      context.closePath();
      
      // Symbol setup
      let symbol = getSymbol();
      const fontfamily = 'Andale Mono';
      context.font = `${this.param.cell_width / 2}px ${fontfamily}`;
      context.fillStyle = this.param.symbol_color;
      
      // Centring a symbol in the cell
      //context.textBaseline = 'top';
      //context.textAlign = 'center';
      const fontmeasures = context.measureText(symbol);
      const mx = fontmeasures.actualBoundingBoxLeft * -1;
      const my = fontmeasures.actualBoundingBoxAscent * -1;
      const mw = fontmeasures.actualBoundingBoxLeft + fontmeasures.actualBoundingBoxRight;
      const mh = fontmeasures.actualBoundingBoxAscent + fontmeasures.actualBoundingBoxDescent;
      const tx = (this.param.cell_width - mw) * 0.5 - mx;
      const ty = (this.param.cell_height - mh) * 0.5 - my;
      const centerx = this.param.x + tx;
      const centery = this.param.y + ty;

      // Displaying a symbol
      context.fillText(symbol, centerx, centery);

    context.restore();
  };
};
const getSymbol = () => {
  const whitespace = '';
  const character_number_variation = random.range(0.6, 0.9);
  const chance = random.chance(character_number_variation);
  if (chance === true) return whitespace;
  const symbols = '•○ ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 ░▒▓ ►◄↕‼¶§▬↑↓→←∟↔▲▼!#$%&()*+,-./:;<=>?@[\\]^_` '.split('');
  return random.pick(symbols);
};


// Background pattern
class BackgroundProperties {
  constructor(x, y, width, height, radius, color, density, destroyx, destroyy, offset, offsetx, offsety, stroke) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.color = color;
    this.density = density;
    this.destroyx = destroyx;
    this.destroyy = destroyy;
    this.offset = offset; // true / false
    this.offsetx = offsetx;
    this.offsety = offsety;
    this.stroke = stroke; // true / false
  };
};
class Background {
  constructor(x, y, width, height, radius, color, density, destroyx, destroyy, offset, offsetx, offsety, stroke) {
    this.param = new BackgroundProperties(x, y, width, height, radius, color, density, destroyx, destroyy, offset, offsetx, offsety, stroke);
  };
  draw(context) {

    context.save();
    
      // Pattern offset correction (re-center)
      if (this.param.offset === true) {
        let x = this.param.x * this.param.offsetx - this.param.width * 1.5; // Multiplication by 1.5 is needed to center grid within the canvas borders
        let y = this.param.y * this.param.offsety - this.param.height * 1.5;
        context.translate(x, y);
      }

      // Grid
      context.beginPath();
      context.strokeStyle = this.param.color;
      context.rect(this.param.x, this.param.y, this.param.width, this.param.height);
      context.closePath();
      if (this.param.stroke === true) this.enable_stroke(context);

      // Particles
      let shift_x = this.param.x;
        if (this.param.destroyx === 1) shift_x = this.param.width * random.range(10, 20);
      let shift_y = this.param.y;
        if (this.param.destroyy === 1) shift_y = this.param.width * random.range(10, 20);
      let variabledensity = random.range(0, this.param.density);
      for (let i = 0; i < variabledensity; i++) {
        context.beginPath();
        context.arc(random.range(this.param.x, this.param.width + shift_x), random.range(this.param.y, this.param.height + shift_y), this.param.radius, Math.PI * 2, 0);
        context.fillStyle = this.param.color;
        context.fill();
        //console.log(this.param.x);
      }

    context.restore();

  };
  enable_stroke(context) {
    
    context.lineWidth = 8;
    context.stroke();

  };
};
// Pattern offset correction (code aims to re-center the grid (doing it bad though :]))
function centerGrid(context, cell_width, cell_height, cell_offset_x, cell_offset_y) {

  let offset_grid_x = cell_width - (cell_width * cell_offset_x) * random.range(2, 8);
  let offset_grid_y = cell_height - (cell_height * cell_offset_y) * random.range(2, 4);
  //console.log('offset correction: ' + offset_grid_x);

  return context.translate(offset_grid_x, offset_grid_y);

};


// Rotate canvas
function rotateCanvas(context, chance, amplitude) {
  const canvas_rotate_chance = random.chance(chance);
  //console.log('canvas rotate chance: ' + canvas_rotate_chance);
  let context_rotate_min, context_rotate_max;
  if (canvas_rotate_chance === true) {
    context_rotate_min = random.range(-amplitude, amplitude);
    context_rotate_max = random.range(-amplitude, amplitude);
  } else {
    context_rotate_min = 0;
    context_rotate_max = 0;
  }
  return context.rotate(random.range(context_rotate_min, context_rotate_max));
};
function rotateCanvasAmplitude() {
  const amplitude = random.pick([0.02, 0.02, 0.02, 0.02, 0.02, 0.04, 0.06, 0.08]); // Repeat 0.02 to increase chances to be selected
  //console.log('rotate amplitude: ' + amplitude);
  return amplitude;
};


// Frames
class FrameProperties {
  constructor(color) {
    this.color = color;
  };
};
class FramePosition {
  constructor(x, y, width, height, gutter) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.gutter = gutter;
  };
};
class Frame {
  constructor(x, y, width, height, gutter, color) {
    this.position = new FramePosition(x, y, width, height, gutter);
    this.properties = new FrameProperties(color);
  };
  draw(context) {

    context.save();

      let narrow_x_chance, narrow_y_chance;

      let narrow_x = 0;
      let narrow_y = 0;
      
      narrow_x_chance = random.chance(0.5);
      narrow_y_chance = random.chance(0.5);
      if (narrow_x_chance === true && narrow_y_chance === false) {
        narrow_x = this.position.gutter * random.range(1, 3);
      } else if (narrow_x_chance === false && narrow_y_chance === true) {
        narrow_y = this.position.gutter * random.range(1, 3);
      } else if (narrow_x_chance === narrow_y_chance) {
        narrow_x = 0;
        narrow_y = 0;
      };
      //console.log(narrow_x, narrow_y);
      
      // Frame
      context.beginPath();
      context.lineWidth = 8;
      context.strokeStyle = this.properties.color;
      context.rect(this.position.x + this.position.gutter + narrow_x,
                   this.position.y + this.position.gutter + narrow_y,
                   this.position.width - this.position.gutter * 2 - narrow_x * 2,
                   this.position.height - this.position.gutter * 2 - narrow_y * 2);
      context.stroke();
      context.closePath();

    context.restore();
  };
};