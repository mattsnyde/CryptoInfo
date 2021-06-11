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