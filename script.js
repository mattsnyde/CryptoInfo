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

const table = document.querySelector("#coins");
const container = document.querySelector("#charting");

const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");

function formatBigNumbers(x) {
  return x.toLocaleString();
}

console.log(timeStampEl.innerHTML);

request(
  "GET",
  "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r1) => {
    console.log(r1);
    let stringified = JSON.parse(r1.target.responseText);
    console.log(stringified);

    let time = stringified.status.timestamp; //gets the time from the stringified object
    let currentTime = new Date(time).toLocaleTimeString(); //convert the tim we retired to local time string
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
  "https://pro-api.coinmarketcap.com/v1/key/info?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r2) => {
    //Gives me information on my plan with their CoinMarket API
    console.log(r2);
    console.log(JSON.parse(r2.target.responseText), "this is r2");
  })
  .catch();

request(
  "GET",
  "https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r3) => {
    //Holds the fiat currency will be good to use later
    console.log(r3);
    console.log("this is r3", JSON.parse(r3.target.responseText));
  })
  .catch();

request(
  "GET",
  "https://pro-api.coinmarketcap.com/v1/partners/flipside-crypto/fcas/listings/latest?CMC_PRO_API_KEY=" +
    apikey.API_KEY
)
  .then((r4) => {
    //Represents the health of the cryptocurrency proiject (determines how scammy it is)
    console.log("this is r4", r4);
  })
  .catch();

// request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=40CMC_PRO_API_KEY='+apikey.API_KEY).then((r5)=>{
//     console.log(r5, 'this is r5')
//     console.log(JSON.parse(r5.target.responseText), 'this is r5')
// }).catch()

request("GET", "https://data.messari.io/api/v2/assets?limit=500")
  .then((r6) => {
    //The api i am using to get the top 500 crypto tokens information is: https://messari.io/api/docs#tag/Assets
    let text = JSON.parse(r6.target.responseText);
    let importantInfo = [];
    let criticalInfo = [];
    let tblBody = document.createElement("tbody");
    for (let i = 0; i < text.data.length; i++) {
      //runs through the arrays that contains all the tokens, there are 500 tokens we are looking at it
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
      importantInfo.push(tokenInfo);
      let row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");

        let cellText = document.createTextNode(importantInfo[i][j]);
        cell.appendChild(cellText);

        row.appendChild(cell);
      }
      tblBody.appendChild(row);

      row.addEventListener("click", () => {
        //When the user clicks on a row we want to update the localStorage of addToWatchList.
        let quickStore = [row.innerHTML]; //Get the innerHTML of the row the user has clicked on
        if (localStorage.getItem("addToWatchList") != null) {
          //Check to make sure our localSTORAGE IS NOT EQUAL TO KNOW
          for (
            let i = 0;
            i < JSON.parse(localStorage.getItem("addToWatchList")).length;
            i++
          ) {
            //Loop through the first array
            for (
              let j = 0;
              j < JSON.parse(localStorage.getItem("addToWatchList"))[i].length;
              j++ //Access the second array
            )
              if (
                quickStore[0].split("<td>")[2].split("</td>")[0] ==
                JSON.parse(localStorage.getItem("addToWatchList"))
                  [i][j].split("<td>")[2]
                  .split("</td>")[0]
              ) {
                //Access the ticker symbols in string version of the row the user has clicked on and compare it to all of the previous ones the user has clicked on by accessing the nested array inside of localStorage and splitting the td's aapart
                console.log("nope");
                quickStore = []; //If they are === we will set quickStore back to an empty array so we are not addign duplicates
              }
          }
        }
        let new_data = quickStore; //assign new_data to quickstore

        if (new_data.length !== 0) {
          //as long as new_data !==0 we will add the new_data to localStorage, if new_data.length is 0 that means that what the user clicked on was a duplicate.
          if (localStorage.getItem("addToWatchList") == null) {
            //if null initialize LS with empty array
            localStorage.setItem("addToWatchList", "[]");
          }
          let old_data = JSON.parse(localStorage.getItem("addToWatchList")); //let old_data === current data inside of LS
          old_data.push(new_data); //add to new Data to LS
          localStorage.setItem("addToWatchList", JSON.stringify(old_data));
        }
      });
    }
    table.appendChild(tblBody);
    container.appendChild(table);

    searchBtn.addEventListener("click", () => {
      let tokenInfo = [];
      let criticalInfo = [];
      let tableBody = document.createElement("tbody");
      searchFeature(text, table, tokenInfo, criticalInfo, tableBody);
    });
  })
  .catch();

const watchListBtn = document.querySelector("#watchList");
const watchListTbl = document.querySelector("#watchListCoins");

let watchListBtnCount = 0;
function displayWatchList() {
  // while(watchListTbl.hasChildNodes()){  //Removes nodes from table while there are still nodes to be removed
  //     watchListTbl.removeChild(watchListTbl.firstChild)
  // }
  let crucialInfo = watchList();
  watchListBtn.addEventListener("click", () => {
    watchListBtnCount++;
    console.log(crucialInfo);

    //  for(let f = 0; f < watchListTbl.rows.length; f++){
    //     for(let g = 0; g < watchListTbl.rows[f].cells.length; g++){
    //         console.log(watchListTbl.rows[f].cells[g].innerHTML)
    //     }
    // }
    // for(let k = 0; k < crucialInfo.length; k++){
    //     for(let l = 0; l <  7; l++){
    //     for(let f = 1, row; row = watchListTbl.rows[f]; f++){
    //         for(let g = 0, col; col = row.cells[f]; g++){
    //           console.log(col.innerText)
    //         //   console.log(crucialInfo[k][l])
    //         }
    //    }
    //     }
    // }

    //  for(let i = 0; i < crucialInfo.length; i++){
    //      for(let j = 0; j < watchListTbl.rows[1].cells[i]; j++){
    //          console.log(watchListTbl.rows[1].cells[i])
    //      }
    //  }
    // if(watchListBtnCount === 1){

    let tblBody = document.createElement("tbody");
    for (let k = 0; k < crucialInfo.length; k++) {
      let row = document.createElement("tr");
      for (let l = 0; l < 7; l++) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode(crucialInfo[k][l]);
        // console.log('testing array', crucialInfo[k][0])
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      tblBody.appendChild(row);
    }
    watchListTbl.appendChild(tblBody); //append our table to the body of the table
    container.appendChild(watchListTbl); //append our table to the container

    // for(let i = 1; i < crucialInfo.length + 1; i++){
    //     console.log(watchListTbl.rows[i].cells[1].innerText, 'how many rowas')

    // }
    // for(let i = 0; i < crucialInfo.length; i++){
    //     for(let l = 1; l < 2; l++){
    //         console.log(crucialInfo[i][l], 'crucial input here')
    //     }
    // }
    // if(watchListBtnCount % 2 === 0){
    //     while(watchListTbl.hasChildNodes()){  //Removes nodes from table while there are still nodes to be removed
    //         watchListTbl.removeChild(watchListTbl.firstChild)
    //     }
    // }

    // }
  });

  searchBtn.addEventListener("click", () => {
    let tableBody = document.createElement("tbody");
    console.log(
      "break here -----------------------------------------------------------------------------------------------------------------------"
    );
    for (let i = 0; i < crucialInfo.length; i++) {
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
displayWatchList(); // <-------------------------------------------------Need to move this, everytime you click on the WATCHLISTBTN the list grows by 1 set, as in localStorage is appended to the table 1 time, then 2 times, then 3 times, then 4, and so forth..

function request(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}

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

function searchFeature(
  arrayName,
  tableName,
  arrayName2,
  arrayName3,
  tBodyName
) {
  console.log("hello");
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
      console.log("rows");
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

function toggleTables() {
  let watchListBtnClickCount = 1;
  watchListBtn.addEventListener("click", () => {
    watchListTbl.style.zIndex = 100;
    table.style.zIndex = -100;
    table.style.display = "none";
    document.querySelector("#watchListCoins").hidden = false;
    if (watchListBtnClickCount % 2 === 0) {
      table.style.display = "block";
      document.querySelector("#watchListCoins").hidden = true;
      watchListTbl.style.zIndex = -100;
      table.style.zIndex = 100;
    }
    watchListBtnClickCount++;
  });
}
toggleTables();

// localStorage.clear();

function countEm() {
  let dupsArraySymbol = [];
  let noDupsArraySymbol = [];
  let realLength = [];
  let fakeLength = [];
  let amountOfDummyFakesIHave = [];
  let numbersToRemove = [];
  for (let i = 1; i < watchListTbl.rows.length; i++) {
    dupsArraySymbol.push(watchListTbl.rows[i].cells[1].innerText);
    // console.log(watchListTbl.rows[i].cells[1].innerText, 'how many rowas')
  }
  console.log(dupsArraySymbol);
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
      noDupsArraySymbol.push(
        JSON.parse(localStorage.getItem("addToWatchList"))
          [i][j].split("<td>")[2]
          .split("</td>")[0]
      );
    }
  }

  realLength.push(JSON.parse(localStorage.getItem("addToWatchList")).length);
  fakeLength.push(watchListTbl.rows.length);
  console.log(realLength[0], "the real number");
  console.log(fakeLength[0], "the fake number");

  // if(fakeLength[0] > realLength[0]){
  //     // console.log(fakeLength[0]-realLength[0])
  //     for(let i = realLength[0] - 2; i < fakeLength[0]; i++){
  //     //    console.log(i)
  //     // document.getElementsByTagName('tr')[i].remove()
  //     document.querySelector('#watchListCoins').deleteRow(i)
  //     // console.log()
  //     // console.log('the fake length', fakeLength[0])
  //     }
  // }
  // for(let i = 0; i < watchListTbl.rows.length; i++){
  //     console.log(i)
  // }

  // for(let i = realLength[0] - 2; i < watchListTbl.rows.length; i++){
  //     numbersToRemove.push(i)
  //     console.log(i)
  //     // document.querySelector('#watchListCoins').deleteRow(i)
  // }
  // console.log(numbersToRemove.length, 'length ')
  // for(let i = 0; i < numbersToRemove.length; i++){

  //     document.querySelector('#watchListCoins').deleteRow(numbersToRemove[i])
  //     console.log(watchListTbl.rows.length, 'the length of table after upodating it')
  // }
  // console.log('breakls-----------------------------------------------------------------------------------------------')
  // if(fakeLength[0] > realLength[0]){
  //     for(let i = realLength[0]; i < fakeLength[0] - realLength[0]; i++){
  //         watchListTbl.rows.remove(i)
  //     }
  // }
}
let fakeBtnCount = 1;
watchListBtn.addEventListener("click", () => {
  // if(fakeBtnCount % 3 === 0){
  countEm();
  //}
  // fakeBtnCount++;
  // countEm();
});
// localStorage.clear()
