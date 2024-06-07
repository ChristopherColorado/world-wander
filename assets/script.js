const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_WIDTH = 25;
const MAP_HEIGHT = 19;

const player = {
  x: Math.floor(MAP_WIDTH / 2) * TILE_SIZE,
  y: Math.floor(MAP_HEIGHT / 2) * TILE_SIZE,
  width: TILE_SIZE,
  height: TILE_SIZE,
  color: "blue",
  speed: 4,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  if (keys.ArrowUp) player.y -= player.speed;
  if (keys.ArrowDown) player.y += player.speed;
  if (keys.ArrowLeft) player.x -= player.speed;
  if (keys.ArrowRight) player.x += player.speed;

  // Boundary collision detection
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height)
    player.y = canvas.height - player.height;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

const TILE_TYPES = {
  EMPTY: "empty",
  TREE: "tree",
  RIVER: "river",
  BRIDGE: "bridge",
  BUILDING: "building",
};

const worldMap = [];

function generateWorld() {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      const rand = Math.random();
      let tileType = TILE_TYPES.EMPTY;

      if (rand < 0.1) tileType = TILE_TYPES.TREE;
      else if (rand < 0.05) tileType = TILE_TYPES.RIVER;
      else if (rand < 0.02) tileType = TILE_TYPES.BRIDGE;
      else if (rand < 0.07) tileType = TILE_TYPES.BUILDING;

      row.push(tileType);
    }
    worldMap.push(row);
  }
}

function drawWorld() {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      switch (worldMap[y][x]) {
        case TILE_TYPES.TREE:
          ctx.fillStyle = "green";
          break;
        case TILE_TYPES.RIVER:
          ctx.fillStyle = "blue";
          break;
        case TILE_TYPES.BRIDGE:
          ctx.fillStyle = "brown";
          break;
        case TILE_TYPES.BUILDING:
          ctx.fillStyle = "grey";
          break;
        default:
          ctx.fillStyle = "lightgrey";
      }
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

generateWorld();
gameLoop();
