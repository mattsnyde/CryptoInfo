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

request('GET', 'https://data.messari.io/api/v2/assets?limit=500').then((r6)=>{ //https://messari.io/api/docs#tag/Assets
    console.log(JSON.parse(r6.target.responseText), 'this is r6')
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




 