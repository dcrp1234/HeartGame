document.addEventListener("DOMContentLoaded", function() {
  const tileContainer = document.getElementById("tile-container");
  let firstClickedTile = null;
  
  // Explicitly declare score
  let score = 0;
  const size = 4;

  // Define possible tile images
  const possibleImages = ["1.png", "2.png", "3.png"];

  // Initialize the tileGrid as a sizexsize array
  const tileGrid = [];

  // Populate the tileGrid with random images
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const randomIndex = Math.floor(Math.random() * possibleImages.length);
      row.push(possibleImages[randomIndex]);
    }
    tileGrid.push(row);
  }

  // Function to create a tile
  function createTile(imageUrl, x, y) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.x = x; 
    tile.dataset.y = y; 
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Tile Image";
    tile.appendChild(img);
    tileContainer.appendChild(tile);

    // Prevent initial three-match grid
    while (
      (x >= 2 && tileGrid[y][x - 1] === imageUrl && tileGrid[y][x - 2] === imageUrl) ||
      (y >= 2 && tileGrid[y - 1][x] === imageUrl && tileGrid[y - 2][x] === imageUrl)
    ) {
      imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
      img.src = imageUrl;
    }
    tileGrid[y][x] = imageUrl;
  }

  // Create tiles based on the tile grid
  tileGrid.forEach((row, rowIndex) => {
    row.forEach((imageUrl, columnIndex) => {
      createTile(imageUrl, columnIndex, rowIndex);
    });
  });

  function checkGrid() {
    for (let j = size - 1; j >= 0; j--) {
      for (let i = 0; i <= size - 1;) {
        let ct = checkHorizontal(tileGrid[j][i], j, i);
        let cv = checkVertical(tileGrid[j][i], j, i);
        if (ct.match || cv.match) {
          if (ct.match) {
            shiftdown(1, ct);
          } else {
            shiftdown(2, cv);
          }
        } else {
          i++;
        }
      }
    }
  }

  function checkHorizontal(img, y, x) {
    const c = {
      match: false,
      firstTileCoordinates: { x: null, y: null },
      secondTileCoordinates: { x: null, y: null } 
    };
    let r = x;
    let l = x;
    while (l > 0) {
      if (tileGrid[y][l-1] == img) {
        l--;
      } else {
        break;
      }
    }
    while (r < size - 1) {
      if (tileGrid[parseInt(y)][parseInt(r)+1] == img) {
        r++;
      } else {
        break;
      }
    }
    if ((r-l) >= 2) {
      c.match = true;
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.y = parseInt(y);
      c.firstTileCoordinates.x = parseInt(l);
      c.secondTileCoordinates.x = parseInt(r);
    }
    return c;
  }

  function checkVertical(img, y, x) {
    const c = {
      match: false,
      firstTileCoordinates: { x: null, y: null },
      secondTileCoordinates: { x: null, y: null } 
    };
    let u = y;
    let l = y;
    while (u > 0) {
      if (tileGrid[u-1][x] == img) {
        u--;
      } else {
        break;
      }
    }
    while (l < size - 1) {
      if (tileGrid[parseInt(l)+1][parseInt(x)] == img) {
        l++;
      } else {
        break;
      }
    }
    if ((l-u) >= 2) {
      c.match = true;
      c.firstTileCoordinates.y = parseInt(u);
      c.secondTileCoordinates.y = parseInt(l);
      c.firstTileCoordinates.x = parseInt(x);
      c.secondTileCoordinates.x = parseInt(x);
    }
    return c;
  }

  function shiftdown(type, c) {
    const x1 = Math.min(c.firstTileCoordinates.x, c.secondTileCoordinates.x);
    const x2 = Math.max(c.firstTileCoordinates.x, c.secondTileCoordinates.x); 
    const y1 = c.firstTileCoordinates.y;
    let y2 = c.secondTileCoordinates.y;

    if (type == 1) {
      // Horizontal shift
      for (let j = y1; j > 0; j--) {  
        for (let i = x1; i <= x2; i++) {
          tileGrid[j][i] = tileGrid[j - 1][i];
          const currentTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
          const aboveTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j - 1}"]`);
          
          if (currentTile && aboveTile) {
            currentTile.querySelector('img').src = aboveTile.querySelector('img').src;
          }
        }
      }
    } else if (type == 2) {
      // Vertical shift
      for (let j = 0; j < y1; j++) {
        tileGrid[y2-j][x1] = tileGrid[y1 - j - 1][x1];
        const currentTile = document.querySelector(`.tile[data-x="${x1}"][data-y="${y2-j}"]`);
        const aboveTile = document.querySelector(`.tile[data-x="${x1}"][data-y="${y1 - j - 1}"]`);
        
        if (currentTile && aboveTile) {
          currentTile.querySelector('img').src = aboveTile.querySelector('img').src;
        }
      }
      y2 = y2 - y1;
    }

    // Generate new images for the top row(s)
    for (let i = x1; i <= x2; i++) {
      let imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
      
      if (y1 == y2) {
        tileGrid[0][i] = imageUrl;
        const topTile = document.querySelector(`.tile[data-x="${i}"][data-y="0"]`);
        if (topTile) {
          topTile.querySelector('img').src = imageUrl;
        }
      } else {
        for (let j = y2; j >= 0; j--) {
          tileGrid[j][i] = imageUrl;
          const topTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
          if (topTile) {
            topTile.querySelector('img').src = imageUrl;
          }
          imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
        }
      }
    }
  }

  function swap(firstX, firstY, secondX, secondY) {
    // Swap tiles in the grid
    const tempTile = tileGrid[firstY][firstX];
    tileGrid[firstY][firstX] = tileGrid[secondY][secondX];
    tileGrid[secondY][secondX] = tempTile;

    // Swap image sources
    const firstTile = document.querySelector(`.tile[data-x="${firstX}"][data-y="${firstY}"]`);
    const secondTile = document.querySelector(`.tile[data-x="${secondX}"][data-y="${secondY}"]`);

    const firstImgSrc = firstTile.querySelector('img').src;
    firstTile.querySelector('img').src = secondTile.querySelector('img').src;
    secondTile.querySelector('img').src = firstImgSrc;
  }

  // Event listener for clicking a tile
  tileContainer.addEventListener("click", function(event) {
    const clickedTile = event.target.closest(".tile");
    if (clickedTile) {
      // if (firstClickedTile) {
      //   firstClickedTile.classList.remove("selected");
      // } 

    // If not the same tile, select the new tile
      if (!firstClickedTile) {
        firstClickedTile = clickedTile;
        firstClickedTile.classList.add("selected");
      } else {
        const firstTileX = parseInt(firstClickedTile.dataset.x);
        const firstTileY = parseInt(firstClickedTile.dataset.y);
        const secondTileX = parseInt(clickedTile.dataset.x);
        const secondTileY = parseInt(clickedTile.dataset.y);
        let isHorizontalSwap = false;
        let isVerticalSwap = false;
        
        if (firstTileX === secondTileX && Math.abs(firstTileY - secondTileY) === 1) {
          isVerticalSwap = true;
        } else if (firstTileY === secondTileY && Math.abs(firstTileX - secondTileX) === 1) {
          isHorizontalSwap = true;
        }

        if (isVerticalSwap || isHorizontalSwap) {  
          swap(firstClickedTile.dataset.x, firstClickedTile.dataset.y, clickedTile.dataset.x, clickedTile.dataset.y);

          // Wait for DOM to update completely
          setTimeout(() => {
            let c1 = checkHorizontal(tileGrid[clickedTile.dataset.y][clickedTile.dataset.x], clickedTile.dataset.y, clickedTile.dataset.x);
            let c2 = checkHorizontal(tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x], firstClickedTile.dataset.y, firstClickedTile.dataset.x);
            let c3 = checkVertical(tileGrid[clickedTile.dataset.y][clickedTile.dataset.x], clickedTile.dataset.y, clickedTile.dataset.x);
            let c4 = checkVertical(tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x], firstClickedTile.dataset.y, firstClickedTile.dataset.x);
           
            if (c1.match || c2.match || c3.match || c4.match) {
              if (c1.match && c2.match) {
                if (c1.firstTileCoordinates.y < c2.firstTileCoordinates.y) {
                  shiftdown(1, c1);
                  shiftdown(1, c2);
                } else {
                  shiftdown(1, c2);
                  shiftdown(1, c1);
                }
              } else {
                let c = c1.match ? c1 : c2;
                shiftdown(1, c); 
              }
              if (c3.match) {
                shiftdown(2, c3);
              }
              if (c4.match) {
                shiftdown(2, c4);
              }

              checkGrid();
              const scoreElement = document.querySelector('.score');
              scoreElement.textContent = score.toString();
            } else {
              swap(firstClickedTile.dataset.x, firstClickedTile.dataset.y, clickedTile.dataset.x, clickedTile.dataset.y);
              firstClickedTile.classList.remove("selected");
              clickedTile.classList.remove("selected");
            }
          }, 500);

          firstClickedTile.classList.remove("selected");
        } else {
          firstClickedTile.classList.remove("selected");
          firstClickedTile = clickedTile;
          firstClickedTile.classList.add("selected");
        }
      }
    }
  });
});