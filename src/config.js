/**
 * 
 * Constants for use across all functions
 * 
 */

const MAP_WIDTH = 60;
const MAP_HEIGHT = 60;

const CROP_WIDTH = 30;
const CROP_HEIGHT = 30;

const TILE_SIZE = 8;
const PLAYER_SIZE = 16;

const MAP = [];
// tiles for map generation
const GROUND_TILES = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    4, 4, 4,
    5, 5,
    16, 
    17, 17, 17,
    18
];

// crop tiles dictionary
// "tile name": "tile location"
const CROP_TILES = {
    "full dirt": 1, 
    "partial dirt": 2, 
    "grown radish": 33,
    "radish seedling": 34,
    "grown wheat": 46,
    "wheat seedling": 47
};

const WATER_TILES = [126, 127, 128];

// Economic system & inventory
const SEED_COUNT = 10;
const MONEY = 0;

const PLANT_COUNT = 0;
