const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_WIDTH = 125; // 5 times larger
const MAP_HEIGHT = 95; // 5 times larger

const canvasWidth = 800;
const canvasHeight = 600;

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
      row.push(TILE_TYPES.EMPTY);
    }
    worldMap.push(row);
  }

  // Add trees
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (Math.random() < 0.1) {
        worldMap[y][x] = TILE_TYPES.TREE;
      }
    }
  }

  // Add buildings
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (Math.random() < 0.07) {
        worldMap[y][x] = TILE_TYPES.BUILDING;
      }
    }
  }

  // Add rivers and bridges
  for (let y = 0; y < MAP_HEIGHT; y++) {
    if (Math.random() < 0.1) {
      const riverX = Math.floor(Math.random() * MAP_WIDTH);
      const bridgePosition = Math.floor(Math.random() * MAP_HEIGHT);
      for (let y2 = 0; y2 < MAP_HEIGHT; y2++) {
        if (y2 === bridgePosition) {
          worldMap[y2][riverX] = TILE_TYPES.BRIDGE;
        } else {
          worldMap[y2][riverX] = TILE_TYPES.RIVER;
        }
      }
    }
  }
}

generateWorld();

const camera = {
  x: 0,
  y: 0,
  width: canvasWidth,
  height: canvasHeight,
};

function updateCamera() {
  camera.x = player.x - camera.width / 2 + player.width / 2;
  camera.y = player.y - camera.height / 2 + player.height / 2;

  // Keep camera within bounds of the world
  if (camera.x < 0) camera.x = 0;
  if (camera.y < 0) camera.y = 0;
  if (camera.x + camera.width > MAP_WIDTH * TILE_SIZE)
    camera.x = MAP_WIDTH * TILE_SIZE - camera.width;
  if (camera.y + camera.height > MAP_HEIGHT * TILE_SIZE)
    camera.y = MAP_HEIGHT * TILE_SIZE - camera.height;
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - camera.x,
    player.y - camera.y,
    player.width,
    player.height
  );
}

function updatePlayer() {
  const newPos = { x: player.x, y: player.y };
  if (keys.ArrowUp) newPos.y -= player.speed;
  if (keys.ArrowDown) newPos.y += player.speed;
  if (keys.ArrowLeft) newPos.x -= player.speed;
  if (keys.ArrowRight) newPos.x += player.speed;

  // Boundary collision detection
  if (newPos.x < 0) newPos.x = 0;
  if (newPos.y < 0) newPos.y = 0;
  if (newPos.x + player.width > MAP_WIDTH * TILE_SIZE)
    newPos.x = MAP_WIDTH * TILE_SIZE - player.width;
  if (newPos.y + player.height > MAP_HEIGHT * TILE_SIZE)
    newPos.y = MAP_HEIGHT * TILE_SIZE - player.height;

  const tileX = Math.floor(newPos.x / TILE_SIZE);
  const tileY = Math.floor(newPos.y / TILE_SIZE);
  const tileType = worldMap[tileY][tileX];

  if (tileType !== TILE_TYPES.RIVER && tileType !== TILE_TYPES.BUILDING) {
    player.x = newPos.x;
    player.y = newPos.y;
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
      ctx.fillRect(
        x * TILE_SIZE - camera.x,
        y * TILE_SIZE - camera.y,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCamera();
  drawWorld();
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
