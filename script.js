const apikey = {
    API_KEY: '2c59aae8-02b8-4d52-b010-8ba1a11c071a'
}//Api key for crytpomarket api

const dollar_format = Intl.NumberFormat('en-US', {style:'currency', currency: 'USD'})//Format in US dollars
 
//containers for timestap, defiMarketccap, altmarketcap, stablemarketcap, totalmarketcap, totalvolume24hrs
const timeStampEl = document.querySelector('#time')
const defiMarketCapEl = document.querySelector('#defiMarketCap')
const altMarketCapEl = document.querySelector('#altMarketCap')
const stableMarketCapEl = document.querySelector('#stableMarketCap')
const totalMarketCapEl = document.querySelector('#totalMarketCap')
const totalVolume24hrsEl = document.querySelector('#totalVolume24hrs')

const table = document.querySelector('#coins')
const container = document.querySelector('#charting')

const searchBtn = document.querySelector('#searchBtn')
const searchInput = document.querySelector('#searchInput')

function formatBigNumbers(x){
    return x.toLocaleString();
}

console.log(timeStampEl.innerHTML)

request('GET', 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY='+apikey.API_KEY).then((r1)=>{
    console.log(r1)
    let stringified = JSON.parse(r1.target.responseText)
    console.log(stringified)

    let time = stringified.status.timestamp; //gets the time from the stringified object 
    let currentTime = new Date(time).toLocaleTimeString(); //convert the tim we retired to local time string
    let currentDate = new Date(time).toLocaleDateString(); //convert the time we retrieved to local date string
    timeStampEl.innerHTML += `<br>${currentDate}<br>${currentTime}` //Set the innerHTML to contain the currentDate and currentTime

    let defiMarketCap = Math.round(parseFloat(stringified.data.defi_market_cap)) //get current market cap of all difi coin
    defiMarketCapEl.innerHTML +=  `<br>${dollar_format.format(defiMarketCap)}`
    
    let altMarketCap = Math.round(parseFloat(stringified.data.quote.USD.altcoin_market_cap)) //current market cpa of all alt coin
    altMarketCapEl.innerHTML += `<br>${dollar_format.format(altMarketCap)}`

    let stableMarketCap = Math.round(parseFloat(stringified.data.stablecoin_market_cap)) //current market cap of all stable coin
    stableMarketCapEl.innerHTML += `<br>${dollar_format.format(stableMarketCap)}`

    let totalMarketCap = Math.round(parseFloat(stringified.data.quote.USD.total_market_cap)) //current market cap of all coins
    totalMarketCapEl.innerHTML += `<br>${dollar_format.format(totalMarketCap)}`

    let totalVolume24hrs = Math.round(parseFloat(stringified.data.quote.USD.total_volume_24h)) //total volume transacted in the past 24hrs. 
    totalVolume24hrsEl.innerHTML += `<br>${dollar_format.format(totalVolume24hrs)}`
}).catch()



request('GET', 'https://pro-api.coinmarketcap.com/v1/key/info?CMC_PRO_API_KEY='+apikey.API_KEY).then((r2)=>{ //Gives me information on my plan with their CoinMarket API
    console.log(r2)
    console.log(JSON.parse(r2.target.responseText), 'this is r2')
}).catch()


request('GET', 'https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY='+apikey.API_KEY).then((r3)=>{ //Holds the fiat currency will be good to use later
    console.log(r3)
    console.log('this is r3', JSON.parse(r3.target.responseText))
}).catch()


request('GET', 'https://pro-api.coinmarketcap.com/v1/partners/flipside-crypto/fcas/listings/latest?CMC_PRO_API_KEY='+apikey.API_KEY).then((r4)=>{ //Represents the health of the cryptocurrency proiject (determines how scammy it is)
    console.log('this is r4', r4)
}).catch()

 
// request('GET', 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=40CMC_PRO_API_KEY='+apikey.API_KEY).then((r5)=>{
//     console.log(r5, 'this is r5')
//     console.log(JSON.parse(r5.target.responseText), 'this is r5')
// }).catch()

request('GET', 'https://data.messari.io/api/v2/assets?limit=500').then((r6)=>{ //The api i am using to get the top 500 crypto tokens information is: https://messari.io/api/docs#tag/Assets
    let text = JSON.parse(r6.target.responseText)
    let importantInfo = [];
    let criticalInfo = [];
    let tblBody = document.createElement('tbody')
    for(let i = 0; i < text.data.length; i++){ //runs through the arrays that contains all the tokens, there are 500 tokens we are looking at it
        //  console.log(text.data[i]) //Logs every single array, which contains our unique toens
        let coinSymbol = text.data[i].symbol
        let coinName = text.data[i].name
        let coinAllTimeHigh = text.data[i].metrics.all_time_high.price
        let coinMarketCapRank = text.data[i].metrics.marketcap.rank
        let coinMarketCapDollar = text.data[i].metrics.marketcap.current_marketcap_usd
        let coinCurrentPrice = text.data[i].metrics.market_data.price_usd
        let volumeLast24Hrs = text.data[i].metrics.market_data.real_volume_last_24_hours
        let tokenInfo = [coinMarketCapRank, coinSymbol, coinName, dollar_format.format(coinMarketCapDollar), dollar_format.format(coinAllTimeHigh), dollar_format.format(coinCurrentPrice), dollar_format.format(volumeLast24Hrs)]
        importantInfo.push(tokenInfo)
     
        let row = document.createElement('tr')
        for(let j = 0; j < 7; j++){
            let cell = document.createElement('td')

            let cellText = document.createTextNode(importantInfo[i][j])
            cell.appendChild(cellText)

            row.appendChild(cell)
        }
        tblBody.appendChild(row)
    }
    table.appendChild(tblBody)
    container.appendChild(table)

    searchBtn.addEventListener('click', () => {
        // console.log(searchInput.value.toLocaleString())
        for(let i = 0; i < text.data.length; i++){ //Run through the 500 arrays of crypto information
            if(text.data[i].name === searchInput.value || text.data[i].symbol === searchInput.value || text.data[i].metrics.marketcap.rank === searchInput.value){ //We want to grab the name inside of text.data[i].name or the symbol and compare that to the value theuser entered in our search box, if either of them exist then we want to clear the table  we have
                while(table.hasChildNodes()){  //Removes nodes from table while there are still nodes to be removed
                    table.removeChild(table.firstChild)
                }
                //We want to innerHTML of our table to the default header and the information of the coin the user enters, this only works if name or symbol or rank line up properply.
                let marketCapFormatted = dollar_format.format(text.data[i].metrics.marketcap.current_marketcap_usd)
                let allTimeHighFormatted = dollar_format.format(text.data[i].metrics.all_time_high.price)
                let currentPriceFormatted  = dollar_format.format(text.data[i].metrics.market_data.price_usd)
                let currentVolume24hrs =  dollar_format.format(text.data[i].metrics.market_data.real_volume_last_24_hours)
                table.innerHTML = ` 
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
                        <td>${text.data[i].metrics.marketcap.rank}</td>
                        <td>${text.data[i].symbol}</td>
                        <td>${text.data[i].name}</td>
                        <td>${marketCapFormatted}</td>
                        <td>${allTimeHighFormatted}</td>
                        <td>${currentPriceFormatted}</td>
                        <td>${currentVolume24hrs}</td>
                `
            }
        }
        if(searchInput.value === ''){ //If the search Field is empty we want to rebuild the entire table, this code is the same code used to initalize the table at the beginning
            table.innerHTML = '';
            //Sets the header of the table.
            table.innerHTML = `
                <tr>
                <th>Market Cap Rank</th>
                <th>Coin Symbol</th>
                <th>Coin Name</th>
                <th>Market Cap</th>
                <th>All Time High</th>
                <th>Current Price</th>
                <th>Volume over 24hrs</th>
                </tr>
            `
            for(let k = 0; k < text.data.length; k++){ //Loop through all 500 arrays, get the data we want want put it inside of tokenInfo array then push it into criticalInfo array then loop through the nested arrays nad place the infromation inside of cells/rows then append to the table. 
                let tokenInfo = [text.data[k].metrics.marketcap.rank, text.data[k].symbol, text.data[k].name, dollar_format.format(text.data[k].metrics.marketcap.current_marketcap_usd), dollar_format.format(text.data[k].metrics.all_time_high.price), dollar_format.format(text.data[k].metrics.market_data.price_usd), dollar_format.format(text.data[k].metrics.market_data.real_volume_last_24_hours)]
                criticalInfo.push(tokenInfo)
                let rows = document.createElement('tr')
                console.log('rows')
                for(let j = 0; j < 7; j++){
                    let cell = document.createElement('td')
        
                    let cellText = document.createTextNode(criticalInfo[k][j])
                    cell.appendChild(cellText)
        
                    rows.appendChild(cell)
                }
                tblBody.appendChild(rows)
            }
            table.appendChild(tblBody)
            container.appendChild(table)
        }
    })
    
}).catch();


function request(method, url){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open(method, url)
        xhr.onload = resolve;
        xhr.onerror = reject
        xhr.send();
    })
}



 