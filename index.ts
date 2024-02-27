const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
//INTERFACES

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

interface FallingState {
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number): void;
  drop(map: Map, tile: Tile, x: number, y: number): void;
}

interface RawTileValue {
  transform(): Tile;
}

interface Input {
  handle(map: Map, player: Player): void;
}


interface Tile {
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(map: Map, player: Player, dx: number): void;
  moveVertical(map: Map, player: Player, dy: number): void;
  update(map: Map, x: number, y: number): void;
  getBlockOnTopState(): FallingState;
}


//END OF INTERFACES

//BEGINNING OF CLASSES IMPLEMENTING INTERFACES

class Right implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, 1);
  }
}

class Left implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, -1);
  }
}

class Up implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, -1);
  }
}

class Down implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, 1);
  }
}


class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

class Falling implements FallingState {
  isFalling() { return true; }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {

  }
  drop(map: Map, tile: Tile, x: number, y: number) {
    map.drop(tile, x, y);
  }
}

  
class Resting implements FallingState {
  isFalling() { return false; }
  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
      player.pushHorizontal(map, tile, dx);
  }
  drop(map: Map, tile: Tile, x: number, y: number) {}
}

class Air implements Tile {
  isAir() { return true; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) { }
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState() {
    return new Falling();
  }
}

class Flux implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    player.move(map, 0, dy);
  } 
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Unbreakable implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    
  }
  moveVertical(map: Map, player: Player, dy: number) {
    
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class PlayerTile implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(map: Map, player: Player, dx: number) {
  }
  moveVertical(map: Map, player: Player, dy: number) {

  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy =  new  FallStrategy(falling);
  }
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    
  }
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy =  new  FallStrategy(falling);
  }
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
    this.fallStrategy.moveHorizontal(map, player, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number) {
    
  }
  update(map: Map, x: number, y: number) {
    this.fallStrategy.update(map, this, x, y);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    this.keyConf.setColor(g);
    this.keyConf.fillRect(g, x, y);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.keyConf.removeLock(map);
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number): void {
    this.keyConf.removeLock(map);
    player.move(map, 0, dy);
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Lockk implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  isAir() { return false; }
  isLock1() { return this.keyConf.is1(); }
  isLock2() { return !this.keyConf.is1(); }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    this.keyConf.setColor(g);
    this.keyConf.fillRect(g, x, y);
  }
  moveHorizontal(map: Map, player: Player, dx: number) {
  }
  moveVertical(map: Map, player: Player, dy: number) {
    
  }
  update(map: Map, x: number, y: number) {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class AirValue implements RawTileValue {
  transform() {
    return new Air();
  }
}
class FluxValue implements RawTileValue {
  transform() {
    return new Flux();
  }
}
class UnbreakableValue implements RawTileValue {
  transform() {
    return new Unbreakable();
  }
}
class PlayerValue implements RawTileValue {
  transform() {
    return new PlayerTile();
  }
}
class StoneValue implements RawTileValue {
  transform() {
    return new Stone(new Resting());
  }
}
class FallingStoneValue implements RawTileValue {
  transform() {
    return new Stone(new Falling());
  }
}
class BoxValue implements RawTileValue {
  transform() {
    return new Box(new Resting());
  }
}
class FallingBoxValue implements RawTileValue {
  transform() {
    return new Box(new Falling());
  }
}
class Key1Value implements RawTileValue {
  transform() {
    return new Key(YELLOW_KEY);
  }
}
class Lock1Value implements RawTileValue {
  transform() {
    return new Lockk(YELLOW_KEY);
  }
}
class Key2Value implements RawTileValue {
  transform() {
    return new Key(BLUE_KEY);
  }
}
class Lock2Value implements RawTileValue {
  transform() {
    return new Lockk(BLUE_KEY);
  }
}



//END OF CLASSES IMPLEMENTING INTERFACES

//BEGINNING OF OTHER CLASSES

class Player {
  private x = 1;
  private y = 1;
  draw(g: CanvasRenderingContext2D) {
    g.fillStyle = "#ff0000";
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveVertical(map: Map, dy: number) {
    map.moveVertical(this, this.x, this.y, dy);
  }
  moveHorizontal(map: Map, dx: number) {
    map.moveHorizontal(this, this.x, this.y, dx);
  }
  move(map: Map, dx: number, dy: number) {
    this.moveToTile(map, this.x + dx, this.y + dy);
  }
  pushHorizontal(map: Map, tile: Tile, dx: number) {
    map.pushHorizontal(this, tile, this.x, this.y, dx);
  }
  moveToTile(map: Map, newx: number, newy: number) {
    map.movePlayer(this.x, this.y, newx, newy);
  this.x = newx;
  this.y = newy;
  }
}

class Map {
  private map: Tile[][];

  constructor() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = RAW_TILES[rawMap[y][x]].transform();
      }
    }
  }
  update() {
    for (let y =  this.map.length - 1; y >= 0; y--) {
      for (let x = 0; x <  this.map[y].length; x++) {
        this.map[y][x].update(this, x, y);
      }
    }  
  }

  draw(g: CanvasRenderingContext2D ) {
    for (let y = 0; y <  this.map.length; y++) {
      for (let x = 0; x <  this.map[y].length; x++) {
        this.map[y][x].draw(g, x, y);
      }
    }
  };

  drop(tile: Tile, x: number, y: number) {
    this.map[y + 1][x] = tile;
    this.map[y][x] = new Air();
  }

  getBlockOnTopState(x: number, y: number) {
    return this.map[y][x].getBlockOnTopState();
  }

  isAir(x: number, y: number) {
    return this.map[y][x].isAir();
  }

  movePlayer(x: number, y: number, newx: number, newy: number) {
    this.map[y][x] = new Air();
    this.map[newy][newx] = new PlayerTile();
  }

  moveHorizontal(player: Player, x: number, y: number, dx: number) {
    this.map[y][x + dx].moveHorizontal(this, player, dx);
  }

  moveVertical(player: Player, x: number, y: number, dy: number) {
    this.map[y + dy][x].moveVertical(this, player, dy);
  }

  remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y <  this.map.length; y++) {
      for (let x = 0; x <  this.map[y].length; x++) {
        if (shouldRemove.check(this.map[y][x])) {
          this.map[y][x] = new Air();
        }
      }
    }
  }

  pushHorizontal(player: Player, tile: Tile, x: number, y: number, dx: number) {
    if (this.map[y][x + dx + dx].isAir()
      && !this.map[y + 1][x  + dx].isAir()
    ) {
        this.map[y][x + dx +dx] = tile;
      player.moveToTile(this, x + dx, y);
    }
  }
}


class KeyConfiguration {
  constructor(private color: string, private removeStrategy: RemoveStrategy, private _1: boolean) {}

  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }

  fillRect(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  }

  removeLock(map: Map) {
    map.remove(this.removeStrategy);
  }

  is1() {
    return this._1;
  }
}

class FallStrategy {
  constructor(private falling: FallingState) {}

  moveHorizontal(map: Map, player: Player, tile: Tile, dx: number) {
    this.falling.moveHorizontal(map, player, tile, dx);
  }

  update(map: Map, tile: Tile, x: number, y: number) {
    this.falling =  map.getBlockOnTopState(x, y + 1);
    this.falling.drop(map, tile, x, y);
  }
}

class RawTile {
  static readonly AIR = new RawTile(new AirValue());
  static readonly FLUX = new RawTile(new FluxValue());
  static readonly UNBREAKABLE = new RawTile(new UnbreakableValue());
  static readonly PLAYER = new RawTile(new PlayerValue());
  static readonly STONE = new RawTile(new StoneValue());
  static readonly FALLING_STONE = new RawTile(new FallingStoneValue());
  static readonly BOX = new RawTile(new BoxValue());
  static readonly FALLING_BOX = new RawTile(new FallingBoxValue());
  static readonly KEY1 = new RawTile(new Key1Value());
  static readonly LOCK1 = new RawTile(new Lock1Value());
  static readonly KEY2 = new RawTile(new Key2Value());
  static readonly LOCK2 = new RawTile(new Lock2Value());

  private constructor(private value: RawTileValue) {}

  transform() {
    return this.value.transform();
  }
}

class Inputs {
  private inputs: Input[] = [];

  handleInputs(map: Map, player: Player) {
    while (this.inputs.length > 0) {
      let input = this.inputs.pop();
      input.handle(map, player);;
    }
  }

  determineInput(e: KeyboardEvent) {
    if (e.key === LEFT_KEY || e.key === "a") this.inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") this.inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") this.inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") this.inputs.push(new Down());
  }

}



//END OF OTHER CLASSES

//BEGINNING OF FUNCTIONS

function update(map: Map, player: Player, inputs: Inputs) {
  inputs.handleInputs(map, player);
  map.update();
}

function draw(map: Map, player: Player) {
  let g = createGraphics();
  map.draw(g);
  player.draw(g);
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function gameLoop(map: Map, player: Player, inputs: Inputs) {
  let before = Date.now();
  update(map, player, inputs);
  draw(map, player);
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(map, player, inputs), sleep);
}



//END OF FUNCTIONS

//BEGINNING OF CONSTANTS


const RAW_TILES = [
  RawTile.AIR,
  RawTile.FLUX,
  RawTile.UNBREAKABLE,
  RawTile.PLAYER,
  RawTile.STONE,
  RawTile.FALLING_STONE,
  RawTile.BOX,
  RawTile.FALLING_BOX,
  RawTile.KEY1,
  RawTile.LOCK1,
  RawTile.KEY2,
  RawTile.LOCK2
]


const rawMap: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

const YELLOW_KEY = new KeyConfiguration("#ffcc00", new RemoveLock1(), true);
const BLUE_KEY = new KeyConfiguration("#00ccff", new RemoveLock2(), false);


//END OF CONSTANTS

//BEGINNING OF SETUP

let inputs = new Inputs();

window.onload = () => {
  let map = new Map();
  let player = new Player();
  gameLoop(map, player, inputs);
}

window.addEventListener("keydown", e => {
  inputs.determineInput(e);
});

//END OF LINE - REPEAT THE SENTENCE