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

const myChart = document.querySelector('#myChart')
const chartContainer = document.querySelector('#chartContainer')

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

request('GET', 'https://pro-api.coinmarketcap.com/v1/fiat/map?CMC_PRO_API_KEY='+apikey.API_KEY).then((r3)=>{ //Holds the fiat currency will be good to use later
    console.log(r3)
    let stringified = JSON.parse(r3.target.responseText) //Get to where the information is stored
    console.log(stringified.data)
    for(let i = 0; i < stringified.data.length; i++){ //While i is less than the array of data we want, print out the name and symbol of the fiat currency. 
        console.log(stringified.data[i].name, stringified.data[i].sign, stringified.data[i].symbol)
    }
}).catch()

const apikeyCharting = {
    apikey: 'P5ID58CJZVI9X4PY'
}


//https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=demo&datatype=csv //Daily 
//https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=USD&apikey=demo //weekly
request('GET', 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=DOGE&market=AZN&apikey='+apikeyCharting.apikey).then((r2)=>{ //monthly, doesnt return every day inside of the month but instead it returns a monthly history over the course of years for example, 2019 jan to -2021 present would bring back an array of 30 
    let test = JSON.parse(r2.target.responseText) 
    console.log(test, 'hello sir')
    // console.log(JSON.parse(r2.target.responseText), 'this is r2')
    // // console.log(JSON.parse(r2.target.responseText))
    let label1 = ['Jan 2019', 'Feb 2019', 'March 2019', 'April 2019', 'May 2019', 'June 2019', 'July 2019', 'Aug 2019', 'Sep 2019', 'Oct 2019', 'Nov 2019', 'Dec 2019',  //Runs along the x column
    'Jan 2020', 'Feb 2020', 'March 2020', 'April 2020', 'May 2020', 'June 2020', 'July 2020', 'Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020'
    ]
    let data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 1000, 10000, 20000, 5000, 9000, 22000, 50000, 60000, 64000, 50000, 48000, 34000, 20000] //Runs along the y column
    color1 = ['blue']
    let chart1 = new Chart (myChart, {
        type: 'line',
        title:'Price History',
        reponsie: true,
        data:{
            labels: label1,
            datasets:[{
                data: data, //runs along y column
                backgroundColor: color1, //Changes the color of the plotted dots
                borderCapStyle: 'butt', //Not sure what this does
                borderWidth: 4, //Changes line of width connecting the dots
                hoverBackgroundColor: 'rgba(0, 255,0, .99)', //When hovering ovr the plotted dots they become green
                pointBorderWidth: 5,
            }]
        },
        options:{
            title: {
                text: 'Price Action History',
                display: true
            },
            scales:{
                y:{
                    ticks:{
                        color: '#d9d2d2'
                    }
                },
                x:{
                    ticks:{
                        color: '#d9d2d2'
                    }
                }
            }
        }
    })
}).catch()

function request(method, url){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open(method, url)
        xhr.onload = resolve;
        xhr.onerror = reject
        xhr.send();
    })
}


