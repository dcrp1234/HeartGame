document.addEventListener("DOMContentLoaded", function() {
    const tileContainer = document.getElementById("tile-container");
    let firstClickedTile = null;
    const size=4;
  
    //initialize score 
    score= 0;
  
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
  
              // //print to check grid
              // for( let j=0;j<size; j++){
              //   for (let i=0; i<size; i++){
              //     console.log(tileGrid[j][i], "");
              //   }
              //   console.log("\n");
              // }
              console.log("yileGrid", tileGrid);
  
  
    /*check if at any time the grid has three horizontal of vertical matches 
    * takes parameter c if c has null values then checks entire grid 
    * then calls shiftdown with that c value 
    * if move has been made and checks only lines above that y value
    */
    function checkGrid(){
     //check all values from y=size-1 to the other y value and from the two passed x values 
     console.log("Inside checkGrid");
     for(let j=size-1; j>=0; j--)
     {
      for(let i=0; i<= size-1;){
        let ct = checkHorizontal(tileGrid[j][i], j, i);
        let cv = checkVertical(tileGrid[j][i], j, i);
        if(ct.match || cv.match){
          if(ct.match){
            shiftdown(1,ct);
          }
          else{
            console.log("Inside vertical match ");
            shiftdown(2, cv);
          }
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
      let r=x;
      let l=x;
      while(l>0){
        if(tileGrid[y][l-1]==img){
          l--;
        }
        else {
          break;
        }
      }
      while(r<size-1){
        //console.log(r, tileGrid[parseInt(y)][r]);
        if(tileGrid[parseInt(y)][parseInt(r)+1]==img){
          r++;
        }
        else{
          break;
        }
      }
      if((r-l) >=2){
        c.match=true;
        c.firstTileCoordinates.y=parseInt(y);
        c.secondTileCoordinates.y=parseInt(y);
        c.firstTileCoordinates.x=parseInt(l);
        c.secondTileCoordinates.x=parseInt(r);
      }
      console.log("Checking line", img, y, x, l, r,(r-l), "\n");
      console.log (c);
      return c;
    }
  
    function checkVertical(img, y, x) {
      const c= {
        match: false,
        firstTileCoordinates: { x: null, y: null },
        secondTileCoordinates: { x: null, y: null } 
      };
      let u=y;//upper
      let l=y;//lower
      while(u>0){
        if(tileGrid[u-1][x]==img){
          u--;
        }
        else {
          break;
        }
      }
      while(l<size-1){
       // console.log(l, tileGrid[parseInt(y)][parseInt(l)+1]);
        if(tileGrid[parseInt(l)+1][parseInt(x)]==img){
          l++;
        }
        else{
          break;
        }
      }
      if((l-u) >=2){
        c.match=true;
        c.firstTileCoordinates.y=parseInt(u);
        c.secondTileCoordinates.y=parseInt(l);
        c.firstTileCoordinates.x=parseInt(x);
        c.secondTileCoordinates.x=parseInt(x);
      }
      console.log(" Inside vertical Checking line", img, y, x, u, l,(l-u), "\n");
      console.log (c);
      return c;
    }
  
    function shiftdown(type, c) {
      console.log ("inside shiftdown");
      const x1 = Math.min(c.firstTileCoordinates.x, c.secondTileCoordinates.x);
      const x2 = Math.max(c.firstTileCoordinates.x, c.secondTileCoordinates.x); 
      const y1 = c.firstTileCoordinates.y;
      let y2 = c.secondTileCoordinates.y;
  
      if(type==1){
        // Shift tiles downwards
        for (let j = y1; j > 0; j--) {  
          for (let i = x1; i <= x2; i++) {
            tileGrid[j][i] = tileGrid[j - 1][i];
            const currentTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
            const aboveTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j - 1}"]`);
            currentTile.querySelector('img').src = aboveTile.querySelector('img').src;
          }
        // let c_row = checkHorizontal(tileGrid[j][i-1], )
        }
        
      }
      else if(type ==2){
        console.log("Type 2", "vertical line ", x2);
        for(let j = 0; j<y1; j++){
          console.log("Swapping ", y2-j, "with", y1-j-1);
          tileGrid[y2-j][x1] = tileGrid[y1 -j- 1][x1];
          const currentTile = document.querySelector(`.tile[data-x="${x1}"][data-y="${y2-j}"]`);
          const aboveTile = document.querySelector(`.tile[data-x="${x1}"][data-y="${y1 -j- 1}"]`);
          currentTile.querySelector('img').src = aboveTile.querySelector('img').src;
        }
        y2=y2-y1;
      }
      else {
        console.log("Invalid type of move");
      }
      // Generate new images for the top row
      for (let i = x1; i <= x2; i++) {
        let imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
        let topTile= null;
        if(y1==y2){
          tileGrid[0][i] = imageUrl; // Update grid with new image
          topTile = document.querySelector(`.tile[data-x="${i}"][data-y="0"]`);
        }
        else {
          console.log("Generating images starting", y2);
          for(let j=y2; j>=0; j--){
            tileGrid[j][i] = imageUrl; // Update grid with new image
            topTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
            imageUrl = possibleImages[Math.floor(Math.random() * possibleImages.length)];
          }
        }
        topTile.querySelector('img').src = imageUrl; // Update img src directly
      }
  
      // requestAnimationFrame(() => {
      //   // Update img src after shifting down
      //   const currentTile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
      //   currentTile.querySelector('img').src = newImageUrl;
      //   });
    
            // //print to check grid
            // for( let j=0;j<size; j++){
            //   for (let i=0; i<size; i++){
            //     console.log(tileGrid[j][i], "");
            //   }
            //   console.log("\n");
            // }
      console.log("yileGrid", tileGrid);
  
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
  
      console.log(firstTile.querySelector('img').src, secondTile.querySelector('img').src)
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
  
            // Call the swap function
            swap(firstClickedTile.dataset.x, firstClickedTile.dataset.y, clickedTile.dataset.x, clickedTile.dataset.y);
  
            // Wait for DOM to update completely
            setTimeout(() => {
            //check if there is a match
            let c1 = checkHorizontal(tileGrid[clickedTile.dataset.y][clickedTile.dataset.x], clickedTile.dataset.y, clickedTile.dataset.x);
            let c2 = checkHorizontal(tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x], firstClickedTile.dataset.y, firstClickedTile.dataset.x);
            let c3 = checkVertical(tileGrid[clickedTile.dataset.y][clickedTile.dataset.x], clickedTile.dataset.y, clickedTile.dataset.x);
            let c4 = checkVertical(tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x], firstClickedTile.dataset.y, firstClickedTile.dataset.x);
           
            if(c1.match || c2.match ||c3.match || c4.match) {
              if(c1.match && c2.match) {
                //sequentially execute both where the higher y value lower row gets prority
                if(c1.firstTileCoordinates.y < c2.firstTileCoordinates.y){
                  shiftdown(1,c1);
                  shiftdown(1,c2);
                }
                else{
                  shiftdown(1,c2);
                  shiftdown(1,c1);
                }
              }
              else{
                let c = c1.match ? c1 : c2;
                shiftdown(1,c); 
              }
              if(c3.match){
                shiftdown(2, c3);
              }
              if(c4.match){
                shiftdown(2, c4);
              }
  
              //check if any lines above has a match horzontally
              let y = c1.firstTileCoordinates.y > c2.firstTileCoordinates.y ? c1.firstTileCoordinates.y : c2.firstTileCoordinates.y;
              checkGrid();
              //score = score+c.firstTileCoordinates.y*10;
              const scoreElement = document.querySelector('.score');
              scoreElement.textContent = score.toString();
  
              console.log("Coordinates of first", firstClickedTile.dataset.y, firstClickedTile.dataset.x, tileGrid[firstClickedTile.dataset.y][firstClickedTile.dataset.x]);
              console.log("Coordinates of second", clickedTile.dataset.y, clickedTile.dataset.x,tileGrid[clickedTile.dataset.y][clickedTile.dataset.x]);
           }
            else{
              // Call the swap function
              swap(firstClickedTile.dataset.x, firstClickedTile.dataset.y, clickedTile.dataset.x, clickedTile.dataset.y);
            }
  
          },500);
          // Remove the selected class from the first clicked tile
          firstClickedTile.classList.remove("selected");
          } else {
            // If the clicked tiles are not horizontally or vertically aligned, deselect the first clicked tile
            firstClickedTile.classList.remove("selected");
            //vbclickedTile.classList.remove("selected");
            firstClickedTile = clickedTile;
            firstClickedTile.classList.add("selected");
          }
        }
      }
    });
  });