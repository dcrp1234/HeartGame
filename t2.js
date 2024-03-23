document.addEventListener("DOMContentLoaded", function() {
  const tileContainer = document.getElementById("tile-container");
  let firstClickedTile = null;

  //initialize score 
  score= 0;

  // Define possible tile images
  const possibleImages = ["1.png", "2.png", "3.png", "4.png", "5.png"];

  // Initialize the tileGrid as a 6x6 array
  const tileGrid = [];

  // Populate the tileGrid with random images
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
      const randomIndex = Math.floor(Math.random() * possibleImages.length);
      row.push(possibleImages[randomIndex]);
    }
    tileGrid.push(row);
  }

 // Function to create a tile
  function createTile(imageUrl, x, y) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.x = x; // Set x-coordinate value
    tile.dataset.y = y; // Set y-coordinate value
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Tile Image";
    tile.appendChild(img);
    tileContainer.appendChild(tile);

    // Check if the newly created tile creates a match horizontally
    if (x >= 2 && tileGrid[y][x - 1] === imageUrl && tileGrid[y][x - 2] === imageUrl) {
      do {
          imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
      } while (tileGrid[y][x - 1] === imageUrl && tileGrid[y][x - 2] === imageUrl);
      // Update the src attribute of the image
      img.src = imageUrl;
    }

    // Check if the newly created tile creates a match vertically
    if (y >= 2 && tileGrid[y - 1][x] === imageUrl && tileGrid[y - 2][x] === imageUrl) {
      // If so, regenerate the imageUrl until it doesn't create a match
      do {
        imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
      } while (tileGrid[y - 1][x] === imageUrl && tileGrid[y - 2][x] === imageUrl);
      // Update the src attribute of the image
      img.src = imageUrl;
    }

    // Update the tileGrid with the final imageUrl
    tileGrid[y][x] = imageUrl;
  }


  // Create tiles based on the tile grid
  tileGrid.forEach((row, rowIndex) => {
    row.forEach((imageUrl, columnIndex) => {
      createTile(imageUrl, columnIndex, rowIndex); // Pass x and y coordinates
    });
  });


  /*check if at any time the grid has three horizontal of vertical matches 
  * takes parameter c if c has null values then checks entire grid 
  * then calls shiftdown with that c value 
  * if move has been made and checks only lines above that y value
  */
  function checkGrid(y){
   //check all values from y=5 to the other y value and from the two passed x values 
   console.log("Inside checkGrid", y);
   for(let j=y; j>=0; j--)
   {
    for(let i=0; i<= 5;){
      let ct = checkHorizontal(tileGrid[j][i], j, i);
      if(ct.match){
        shiftdown(ct);
      }
      else {
        i++;
      }
    }
   }

  }



  function checkHorizontal(img, y, x) {
    const c= {
      match: false,
      firstTileCoordinates: { x: null, y: null },
      secondTileCoordinates: { x: null, y: null } 
    };
    if((x> 0) && (x<(tileGrid.length -1)) && tileGrid[y][x-1] == img && tileGrid[y][(parseInt(x)+1)]== img ){
      console.log("inside if");
      c.match = true;
      c.firstTileCoordinates.x = x - 1;
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.x = parseInt(x)+1;
      c.secondTileCoordinates.y = parseInt(y);
    }
    else if ((x<=tileGrid.length-3) && tileGrid[y][(parseInt(x)+1)] == img && tileGrid[y][(parseInt(x)+2)]== img) {
      console.log("inside else if for right");
      c.match = true;
      c.firstTileCoordinates.x = parseInt(x);
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.x = parseInt(x)+2;
      c.secondTileCoordinates.y = parseInt(y);
    }
    else if (x>=2 && tileGrid[y][x-1] == img && tileGrid[y][x-2] == img){
      console.log("inside else if for left");
      c.match = true;
      c.firstTileCoordinates.x = parseInt(x);
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.x = x - 2;
      c.secondTileCoordinates.y = parseInt(y);
    }
    
    console.log("Checking line", y, x, "\n");
    console.log (c);
    return c;
  }

  /*function checkVertical(img, y, x) {
    const c= {
      match: false,
      firstTileCoordinates: { x: null, y: null },
      secondTileCoordinates: { x: null, y: null } 
    };
    if((y> 0) && (y<(tileGrid.length -1)) && tileGrid[y-1][x] == img && tileGrid[(parseInt(y)+1)][x]== img ){
      console.log("inside if");
      c.match = true;
      c.firstTileCoordinates.y = y - 1;
      c.firstTileCoordinates.x = parseInt(x);
      c.secondTileCoordinates.y = parseInt(y)+1;
      c.secondTileCoordinates.x = parseInt(x);
    }
    else if ((y<=tileGrid.length-3) && tileGrid[(parseInt(y)+1)][x] == img && tileGrid[(parseInt(y)+2)][x]== img) {
      console.log("inside else if for right");
      c.match = true;
      c.firstTileCoordinates.x = parseInt(x);
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.y = parseInt(y)+2;
      c.secondTileCoordinates.x = parseInt(x);
    }
    else if (y>=2 && tileGrid[y-1][x] == img && tileGrid[y-2][x] == img){
      console.log("inside else if for left");
      c.match = true;
      c.firstTileCoordinates.x = parseInt(x);
      c.firstTileCoordinates.y = parseInt(y);
      c.secondTileCoordinates.y = y - 2;
      c.secondTileCoordinates.x = parseInt(x);
    }
    
    console.log("Checking line", y, x, "\n");
    console.log (c);
    return c;
  }
*/


  function shiftdown(c) {
    const x1 = Math.min(c.firstTileCoordinates.x, c.secondTileCoordinates.x);
    const x2 = Math.max(c.firstTileCoordinates.x, c.secondTileCoordinates.x); 
    const y = c.firstTileCoordinates.y;
    
    // Shift tiles downwards
    for (let j = y; j > 0; j--) {  
      for (let i = x1; i <= x2; i++) {
        tileGrid[j][i] = tileGrid[j - 1][i];
        const currentTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
        const aboveTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j - 1}"]`);
        currentTile.querySelector('img').src = aboveTile.querySelector('img').src;
      }
    // let c_row = checkHorizontal(tileGrid[j][i-1], )
    }
    
    // Generate new images for the top row
    for (let i = x1; i <= x2; i++) {
      const imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
      tileGrid[0][i] = imageUrl; // Update grid with new image
      const topTile = document.querySelector(`.tile[data-x="${i}"][data-y="0"]`);
      topTile.querySelector('img').src = imageUrl; // Update img src directly
    }
  }

  // Event listener for clicking a tile
  tileContainer.addEventListener("click", function(event) {
    const clickedTile = event.target.closest(".tile");
    if (clickedTile) {
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

        //if a swap is possible only then check if match is possible only then match and shift down
        if (isVerticalSwap || isHorizontalSwap) {  

          console.log("Coordinates of first", firstClickedTile.dataset.y, firstClickedTile.dataset.x, tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x]);
          console.log("Coordinates of second", clickedTile.dataset.y, clickedTile.dataset.x,tileGrid[clickedTile.dataset.y][clickedTile.dataset.x]);

          //check if there is a match
          let c1 = checkHorizontal(tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x], clickedTile.dataset.y, clickedTile.dataset.x);
          let c2 = checkHorizontal(tileGrid[clickedTile.dataset.y][clickedTile.dataset.x], firstClickedTile.dataset.y, firstClickedTile.dataset.x);

          if(c1.match || c2.match) {
            let temp = tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x];
            tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x] = tileGrid[clickedTile.dataset.y][clickedTile.dataset.x];
            tileGrid[clickedTile.dataset.y][clickedTile.dataset.x] = temp;
            const firstTile = document.querySelector(`.tile[data-x="${firstClickedTile.dataset.x}"][data-y="${firstClickedTile.dataset.y}"]`);
            const secondTile = document.querySelector(`.tile[data-x="${clickedTile.dataset.x}"][data-y="${clickedTile.dataset.y}"]`);
            temp = null;
            temp = firstTile.querySelector('img').src;
            firstTile.querySelector('img').src = secondTile.querySelector('img').src;
            secondTile.querySelector('img').src = temp;
            
            if(c1.match && c2.match) {
              //sequentially execute both
              if(c1.firstTileCoordinates.y < c2.firstTileCoordinates.y){
                shiftdown(c1);
                shiftdown(c2);
              }
              else{
                shiftdown(c2);
                shiftdown(c1);
              }
            }
            else{
              let c = c1.match ? c1 : c2;
              shiftdown(c); 
            }
            let y = c1.firstTileCoordinates.y > c2.firstTileCoordinates.y ? c1.firstTileCoordinates.y : c2.firstTileCoordinates.y;
            checkGrid(y);
            score = score+c.firstTileCoordinates.y*10;
            const scoreElement = document.querySelector('.score');
            scoreElement.textContent = score.toString();

            console.log("Coordinates of first", firstClickedTile.dataset.y, firstClickedTile.dataset.x, tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x]);
            console.log("Coordinates of second", clickedTile.dataset.y, clickedTile.dataset.x,tileGrid[clickedTile.dataset.y][clickedTile.dataset.x]);
          }

          // Remove the selected class from the first clicked tile
          firstClickedTile.classList.remove("selected");
        } else {
          // If the clicked tiles are not horizontally or vertically aligned, deselect the first clicked tile
          firstClickedTile.classList.remove("selected");
          firstClickedTile = clickedTile;
          firstClickedTile.classList.add("selected");
        }
      }
    }
  });
});