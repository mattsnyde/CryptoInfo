const apikey = {
  API_KEY: "2c59aae8-02b8-4d52-b010-8ba1a11c071a",
}; //Api key for crytpomarket api

const dollar_format = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}); //Format in US dollars

//containers for timestap, defiMarketccap, altmarketcap, stablemarketcap, totalmarketcap, totalvolume24hrs
const timeStampEl = document.querySelector("#time");
const defiMarketCapEl = document.querySelector("#defiMarketCap");
const altMarketCapEl = document.querySelector("#altMarketCap");
const stableMarketCapEl = document.querySelector("#stableMarketCap");
const totalMarketCapEl = document.querySelector("#totalMarketCap");
const totalVolume24hrsEl = document.querySelector("#totalVolume24hrs");

//Lines19-20, main table with the 500 coins listed as wlel as the container in which the chart is held in
const table = document.querySelector("#coins");
const container = document.querySelector("#charting");

//Lines 23-24 searchBtn as well as searchBar the suer can use to find the specific coins theat they are looking for
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");

//Lines 27-28  are the watchListBtn and the table itself, the btn allowsthe user to toggle between the main table with 500 coins and the coins that they are personally watching
const watchListBtn = document.querySelector("#watchList");
const watchListTbl = document.querySelector("#watchListCoins");

function formatBigNumbers(x) {
  return x.toLocaleString();
}

request(
  "GET",
  "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r1) => {
    let stringified = JSON.parse(r1.target.responseText);

    let time = stringified.status.timestamp; //gets the time from the stringified object
    let currentTime = new Date(time).toLocaleTimeString(); //convert the time we retired to local time string
    let currentDate = new Date(time).toLocaleDateString(); //convert the time we retrieved to local date string
    timeStampEl.innerHTML += `<br>${currentDate} ${currentTime}`; //Set the innerHTML to contain the currentDate and currentTime

    let defiMarketCap = Math.round(
      parseFloat(stringified.data.defi_market_cap)
    ); //get current market cap of all difi coin
    defiMarketCapEl.innerHTML += `<br>${dollar_format.format(defiMarketCap)}`;

    let altMarketCap = Math.round(
      parseFloat(stringified.data.quote.USD.altcoin_market_cap)
    ); //current market cpa of all alt coin
    altMarketCapEl.innerHTML += `<br>${dollar_format.format(altMarketCap)}`;

    let stableMarketCap = Math.round(
      parseFloat(stringified.data.stablecoin_market_cap)
    ); //current market cap of all stable coin
    stableMarketCapEl.innerHTML += `<br>${dollar_format.format(
      stableMarketCap
    )}`;

    let totalMarketCap = Math.round(
      parseFloat(stringified.data.quote.USD.total_market_cap)
    ); //current market cap of all coins
    totalMarketCapEl.innerHTML += `<br>${dollar_format.format(totalMarketCap)}`;

    let totalVolume24hrs = Math.round(
      parseFloat(stringified.data.quote.USD.total_volume_24h)
    ); //total volume transacted in the past 24hrs.
    totalVolume24hrsEl.innerHTML += `<br>${dollar_format.format(
      totalVolume24hrs
    )}`;
  })
  .catch();

request(
  "GET",
  "https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r3) => {
    //Holds the fiat currency will be good to use later
  })
  .catch();

let oldNumber = [];
let newNumber = [];
request("GET", "https://data.messari.io/api/v2/assets?limit=500")
  .then((r6) => {
    //The api i am using to get the top 500 crypto tokens information is: https://messari.io/api/docs#tag/Assets
    let text = JSON.parse(r6.target.responseText);
    let importantInfo = [];
    let criticalInfo = [];
    let tblBody = document.createElement("tbody"); //create a table body
    tblBody.classList.add("text-success"); //Bootstrap class to give green numbers
    tblBody.classList.add("table-responsive");
    for (let i = 0; i < text.data.length; i++) {
      //text.data.length represents the number of rows which in this case is 500.
      //Lines 125-142 run through the information we are collecting on the top 500 coins such as the symbol of coin, name, all time high, market cap rank, coin market cap, current price, and volume over 24hrsd.
      let coinSymbol = text.data[i].symbol;
      let coinName = text.data[i].name;
      let coinAllTimeHigh = text.data[i].metrics.all_time_high.price;
      let coinMarketCapRank = text.data[i].metrics.marketcap.rank;
      let coinMarketCapDollar =
        text.data[i].metrics.marketcap.current_marketcap_usd;
      let coinCurrentPrice = text.data[i].metrics.market_data.price_usd;
      let volumeLast24Hrs =
        text.data[i].metrics.market_data.real_volume_last_24_hours;
      let tokenInfo = [
        coinMarketCapRank,
        coinSymbol,
        coinName,
        dollar_format.format(coinMarketCapDollar),
        dollar_format.format(coinAllTimeHigh),
        dollar_format.format(coinCurrentPrice),
        dollar_format.format(volumeLast24Hrs),
      ];
      importantInfo.push(tokenInfo); //Here I create a nested array with my token info so i can populate my table with new rows and cells.
      let row = document.createElement("tr"); //create row
      for (let j = 0; j < 7; j++) {
        //7 represents the amount of columns in each row
        let cell = document.createElement("td"); //create cell

        let cellText = document.createTextNode(importantInfo[i][j]); //the cellText is information stored inside of the nested array
        cell.appendChild(cellText); //append cellText to cell

        row.appendChild(cell); //append row to cell
      }
      tblBody.appendChild(row); //append row to tblBody

      row.addEventListener("click", () => {
        let tableBody = document.createElement("tbody"); //create table Body
        let quickStore = [row.innerHTML]; //Get the innerHTML of the row the user has clicked on
        let nestedTestingStorage = []; //Lines 158-159 create nested array for quickStore infromation
        nestedTestingStorage.push(quickStore);

        for (let i = 0; i < 1; i++) {
          //We are only adding 1 row at a time hence the number 1 in the for loop
          let row = document.createElement("tr"); //create a row
          for (let j = 1; j < 8; j++) {
            let cell = document.createElement("td"); //create a cell
            let cellText = document.createTextNode(
              //set cellText to information inside of nested array called nestedTestingStorage
              nestedTestingStorage[i][i].split("<td>")[j].split("</td>")[i]
            );
            cell.appendChild(cellText); //append cellText to cell
            row.appendChild(cell); //append row to cell
          }
          tableBody.appendChild(row); //append row to tableBody
        }
        watchListTbl.appendChild(tableBody); //append our table to the body of the table
        container.appendChild(watchListTbl); //append our table to the container
        //Lines 176-193 our localStorage is nested arrays so we are parsing the storage and then running through the arrays to see if we have duplicate coin market caps anywhere inside of our localStorage and if we do we will revert quickStore back to an empty array and prevent them from being added to the watchListTbl
        if (localStorage.getItem("addToWatchList") != null) {
          for (
            let i = 0;
            i < JSON.parse(localStorage.getItem("addToWatchList")).length;
            i++
          ) {
            for (
              let j = 0;
              j < JSON.parse(localStorage.getItem("addToWatchList"))[i].length;
              j++
            )
              if (
                quickStore[0].split("<td>")[2].split("</td>")[0] ==
                JSON.parse(localStorage.getItem("addToWatchList"))
                  [i][j].split("<td>")[2]
                  .split("</td>")[0]
              ) {
                console.log("nope");
                quickStore = []; //If they are === we will set quickStore back to an empty array so we are not addign duplicates
              }
          }
        }
        let new_data = quickStore; //assign new_data to quickstore
        newNumber.push(new_data.length);
        if (new_data.length !== 0) {
          //as long as new_data !==0 we will add the new_data to localStorage, if new_data.length is 0 that means that what the user clicked on was a duplicate.
          if (localStorage.getItem("addToWatchList") == null) {
            //if null initialize LS with empty array
            localStorage.setItem("addToWatchList", "[]");
          }
          let old_data = JSON.parse(localStorage.getItem("addToWatchList")); //let old_data === current data inside of LS
          oldNumber.push(old_data.length);
          old_data.push(new_data); //add to new Data to LS
          localStorage.setItem("addToWatchList", JSON.stringify(old_data));
        }
      });
    }
    table.appendChild(tblBody);
    container.appendChild(table);

    searchBtn.addEventListener("click", () => {
      //The searchBtn eventListener is used to bring up specific coins the user is looking for, they can be found via, coin rank, coin name, or coin symbol.
      let tokenInfo = [];
      let criticalInfo = [];
      let tableBody = document.createElement("tbody");
      searchFeature(text, table, tokenInfo, criticalInfo, tableBody);
    });
  })
  .catch();

function watchListSearch() {
  //Although we have a function called SearchFeature unforntunaltey watchListSearch needs its own search tool as its formatting is a tad different.
  let crucialInfo = watchList(); //assign watchList to crucialInfo
  searchBtn.addEventListener("click", () => {
    let tableBody = document.createElement("tbody");
    for (let i = 0; i < crucialInfo.length; i++) {
      //Check to see if crucialInfo coin ranks, coin symbols, or coin names matches the searchInput.value
      if (
        searchInput.value === crucialInfo[i][1] ||
        searchInput.value === crucialInfo[i][2] ||
        searchInput.value === crucialInfo[i][0]
      ) {
        //Check to see if user input matches the name, symbol, or rank number of any coin listed on the watchList
        //Lines 234-240 I am looping through crucialInfo nested array to extract the information I need
        let marketCapRank = crucialInfo[i][0];
        let coinSymbol = crucialInfo[i][1];
        let coinName = crucialInfo[i][2];
        let coinMarketCapDollar = crucialInfo[i][3];
        let coinAllTimeHigh = crucialInfo[i][4];
        let coinCurrentPrice = crucialInfo[i][5];
        let volumeLast24Hrs = crucialInfo[i][6];

        //Lines 242-261 set the header of the watchList
        watchListTbl.innerHTML = ` 
                    <tr>
                        <th>Market Cap Rank</th>
                        <th>Coin Symbol</th>
                        <th>Coin Name</th>
                        <th>Market Cap</th>
                        <th>All Time High</th>
                        <th>Current Price</th>
                        <th>Volume over 24hrs</th>
                    </tr>
                    <tr>
                        <td>${marketCapRank}</td>
                        <td>${coinSymbol}</td>
                        <td>${coinName}</td>
                        <td>${coinMarketCapDollar}</td>
                        <td>${coinAllTimeHigh}</td>
                        <td>${coinCurrentPrice}</td>
                        <td>${volumeLast24Hrs}</td>       
                `;
      }
      if (searchInput.value === "") {
        //If nothing is in the search bar and user hits the button then I want to return everything inside of the watch list
        watchListTbl.innerHTML = "";
        //Sets the header of the table.
        watchListTbl.innerHTML = `
                        <tr>
                        <th>Market Cap Rank</th>
                        <th>Coin Symbol</th>
                        <th>Coin Name</th>
                        <th>Market Cap</th>
                        <th>All Time High</th>
                        <th>Current Price</th>
                        <th>Volume over 24hrs</th>
                        </tr>
                    `;
        for (let k = 0; k < crucialInfo.length; k++) {
          //Loop through all arrays inside of crucialInfo, get the data we want want and the begin placing it inside of cells
          let rows = document.createElement("tr"); //create rows
          for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td"); //create cells

            let cellText = document.createTextNode(crucialInfo[k][j]); //populate cells with the information inside of the nested array crucialInfo
            cell.appendChild(cellText);

            rows.appendChild(cell); //append the cells to the rows
          }
          tableBody.appendChild(rows); //append the rows to the body of the table
        }
        watchListTbl.appendChild(tableBody); //append our table to the body of the table
        container.appendChild(watchListTbl); //append our table to the container
      }
    }
  });
}
watchListSearch();

//The watchList function runs through our localStorage to get all of the tokens stored inside. LocalStorage as mentioned above is a bunch of nested arrays.
//Inorder to get the text that we are lookign for I have parse the localStorage and split on the <td> element and then access the array I want and split on the </td> and access the [0] element in the final array.
//I then put all of these variables inside of an array called tokenInfo and then i push that array to another array making a nested array. This nested array will be used inside of the savedContent function
//in order to display the localStorage
function watchList() {
  let importantInfo = [];
  for (
    let i = 0;
    i < JSON.parse(localStorage.getItem("addToWatchList")).length;
    i++
  ) {
    //Loop through the first array
    for (
      let j = 0;
      j < JSON.parse(localStorage.getItem("addToWatchList"))[i].length;
      j++
    ) {
      //Access the second array
      let coinMarketCapRank = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[1]
        .split("</td>")[0]; //rank
      let coinSymbol = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[2]
        .split("</td>")[0];
      let coinName = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[3]
        .split("</td>")[0];
      let coinMarketCap = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[4]
        .split("</td>")[0];
      let coinAllTimeHigh = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[5]
        .split("</td>")[0];
      let coinCurrentPrice = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[6]
        .split("</td>")[0];
      let volumeLast24hrs = JSON.parse(localStorage.getItem("addToWatchList"))
        [i][j].split("<td>")[7]
        .split("</td>")[0];

      let tokenInfo = [
        coinMarketCapRank,
        coinSymbol,
        coinName,
        coinMarketCap,
        coinAllTimeHigh,
        coinCurrentPrice,
        volumeLast24hrs,
      ];
      importantInfo.push(tokenInfo);
    }
  }
  return importantInfo;
}

function searchFeature( //searchFeature is an abstract function for searching through the main table of 500 coins.
  arrayName,
  tableName,
  arrayName2,
  arrayName3,
  tBodyName
) {
  for (let i = 0; i < arrayName.data.length; i++) {
    //Run through the 500 arrays of crypto information
    if (
      arrayName.data[i].name === searchInput.value ||
      arrayName.data[i].symbol === searchInput.value ||
      arrayName.data[i].metrics.marketcap.rank === parseInt(searchInput.value)
    ) {
      //We want to grab the name inside of text.data[i].name or the symbol and compare that to the value theuser entered in our search box, if either of them exist then we want to clear the table  we have
      while (tableName.hasChildNodes()) {
        //Removes nodes from table while there are still nodes to be removed
        tableName.removeChild(tableName.firstChild);
        console.log("removed");
      }
      //We want to innerHTML of our table to the default header and the information of the coin the user enters, this only works if name or symbol or rank line up properply.
      let marketCapFormatted = dollar_format.format(
        arrayName.data[i].metrics.marketcap.current_marketcap_usd
      );
      let allTimeHighFormatted = dollar_format.format(
        arrayName.data[i].metrics.all_time_high.price
      );
      let currentPriceFormatted = dollar_format.format(
        arrayName.data[i].metrics.market_data.price_usd
      );
      let currentVolume24hrs = dollar_format.format(
        arrayName.data[i].metrics.market_data.real_volume_last_24_hours
      );
      tableName.classList.add("text-success"); //Bootstrap class, the search results will always be green from now on
      //Lines 342-360 create the heading of the table and populate with the data the user is looking for.
      tableName.innerHTML = ` 
                <tr>
                    <th>Market Cap Rank</th>
                    <th>Coin Symbol</th>
                    <th>Coin Name</th>
                    <th>Market Cap</th>
                    <th>All Time High</th>
                    <th>Current Price</th>
                    <th>Volume over 24hrs</th>
                </tr>
                <tr>
                    <td>${arrayName.data[i].metrics.marketcap.rank}</td>
                    <td>${arrayName.data[i].symbol}</td>
                    <td>${arrayName.data[i].name}</td>
                    <td>${marketCapFormatted}</td>
                    <td>${allTimeHighFormatted}</td>
                    <td>${currentPriceFormatted}</td>
                    <td>${currentVolume24hrs}</td>       
            `;
    }
  }
  if (searchInput.value === "") {
    //If the search Field is empty we want to rebuild the entire table, this code is the same code used to initalize the table at the beginning
    tableName.innerHTML = "";
    //Sets the header of the table.
    tableName.innerHTML = `
            <tr>
            <th>Market Cap Rank</th>
            <th>Coin Symbol</th>
            <th>Coin Name</th>
            <th>Market Cap</th>
            <th>All Time High</th>
            <th>Current Price</th>
            <th>Volume over 24hrs</th>
            </tr>
        `;
    for (let k = 0; k < arrayName.data.length; k++) {
      //Loop through all 500 arrays, get the data we want want put it inside of tokenInfo array then push it into criticalInfo array then loop through the nested arrays nad place the infromation inside of cells/rows then append to the table.
      let arrayName2 = [
        arrayName.data[k].metrics.marketcap.rank,
        arrayName.data[k].symbol,
        arrayName.data[k].name,
        dollar_format.format(
          arrayName.data[k].metrics.marketcap.current_marketcap_usd
        ),
        dollar_format.format(arrayName.data[k].metrics.all_time_high.price),
        dollar_format.format(arrayName.data[k].metrics.market_data.price_usd),
        dollar_format.format(
          arrayName.data[k].metrics.market_data.real_volume_last_24_hours
        ),
      ];
      arrayName3.push(arrayName2);
      let rows = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");

        let cellText = document.createTextNode(arrayName3[k][j]);
        cell.appendChild(cellText);

        rows.appendChild(cell);
      }
      tBodyName.appendChild(rows);
    }
    tableName.appendChild(tBodyName);
    container.appendChild(tableName);
  }
}
//The function toggleTables is used to hide and display the tables, since I am not using mutliple pages to display the tables and clicking is a part of the functionality to add coins to your watchList
//I had to hide tables when the user clicks the watchList btn as well as switch zIndex
function toggleTables() {
  let watchListBtnClickCount = 1;
  watchListBtn.addEventListener("click", () => {
    watchListTbl.style.zIndex = 100;
    watchListTbl.style.opacity = 1;
    table.style.zIndex = -100;
    table.style.display = "none";
    document.querySelector("#watchListCoins").hidden = false;
    if (watchListBtnClickCount % 2 === 0) {
      table.style.display = "block";
      document.querySelector("#watchListCoins").hidden = true;
      watchListTbl.style.zIndex = -100;
      table.style.zIndex = 100;
      watchListTbl.style.opacity = 0;
    }
    watchListBtnClickCount++;
  });
}
toggleTables();

//savedContent is a nested function which will only run 1 time and no more, this function is used for the localStorage, if this code where to be outside of this function which only executes once then
//this code would keep on executing and it would create a lot of duplicates inside of the watchListTbl
let savedContent = (function () {
  let executed = false;
  return function () {
    if (!executed) {
      executed = true;
      let crucialInfo = watchList(); //assign crucialInfo to the nestedArray that is returned fromw watchListFunction
      let tblBody = document.createElement("tbody"); //create table body
      for (let k = 0; k < crucialInfo.length; k++) {
        //Loop through crucialInfo rows
        let row = document.createElement("tr"); //create row element
        for (let l = 0; l < 7; l++) {
          //loop through crucialInfo cells
          let cell = document.createElement("td"); //create cells element
          let cellText = document.createTextNode(crucialInfo[k][l]); //assign cellText to informatioon stored in the nested array crucialInfo
          cell.appendChild(cellText); //append cellText to cell
          row.appendChild(cell); //append row to cell
        }
        tblBody.appendChild(row); //append row to table Body
      }
      watchListTbl.appendChild(tblBody); //append our table to the body of the table
      container.appendChild(watchListTbl); //append our table to the container
    }
  };
})();
savedContent();

function request(method, url) {
  //This function is the power behind the api I am using on this project, The function contains another promise function which is returned
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest(); //assign xhr to HttpRequest
    xhr.open(method, url); //when its open we want to pass method and url
    xhr.onload = resolve; //if everything goes correct we want to resolve and get the information
    xhr.onerror = reject; //if there is an error reject/
    xhr.send(); //send the information back to us
  });
}

const clearWatchList = document.querySelector(".clearWatchList"); //Clear watchList btn
clearWatchList.addEventListener("click", () => {
  while (watchListTbl.hasChildNodes()) {
    //remove all rows from watchList, like it never existed
    watchListTbl.removeChild(watchListTbl.firstChild);
  }
  localStorage.clear(); //also empty out the localSTORAGE.
});
