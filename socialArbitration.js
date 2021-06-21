//The API being used here is the coin paprika api which I am using to retrieve twitter information on certain coins,
const container = document.querySelector(".main");
const search = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");

// request("GET", "https://api.coinpaprika.com/v1/coins/btc-bitcoin/twitter") //Gets tweets related to the cryptocurrency
//   .then((r1) => {
//     let allTweetsAboutToken = [];
//     let tweetsAboutToken = [];
//     console.log(JSON.parse(r1.target.responseText), "this is r1");
//     let response = JSON.parse(r1.target.responseText);
//     displayTweets(response); //pass in response which is an object of arrays to displayTweets function which will show all the tweets inside of a div.
//   })
//   .catch();

function displayTweets(array) {
  main.innerHTML = "";
  array.forEach((tweet) => {
    let postDate = tweet.date; //get Post date of tweet
    let convertDate = new Date(postDate); //create a new Date with the post Date
    let actualDate = `${convertDate.getFullYear()}/${
      //extract the year/date/month from the tweet
      convertDate.getMonth() + 1
    }/${convertDate.getDate()}`;
    let userVar = tweet.user_name; //get twitter handle
    let userIconVar = tweet.user_image_link; //get icon of twitter user profile
    let textVar = tweet.status; //get tweet text
    const tweetElement = document.createElement("div"); //create a div
    tweetElement.classList.add("tweet"); //assign a class of tweet to div
    //Set the innerHTML of each div to have the users icon, their name, the date the tweet was posted, as well as the the text in the tweet
    tweetElement.innerHTML = ` 
            <img src = ${userIconVar} alt = "${userVar}"/>
            <h1 class = "userName" id="userName">USER NAME</br>${userVar}</h1>
            <h2 class = "message" id = "message">MESSAGE</br>${textVar}</h2>
            <h4 class = "datePosed" id = "datePosted">DATE POSTED</br>${actualDate}</h4>
    `;
    main.appendChild(tweetElement);
  });
}

// request("GET", "https://api.coinpaprika.com/v1/coins")
//   .then((r2) => {
//     console.log(JSON.parse(r2.target.responseText), "this is r2");
//     let response = JSON.parse(r2.target.responseText);
//     checkAllId(response);
//   })
//   .catch();

searchBtn.addEventListener("click", () => {
  request("GET", "https://api.coinpaprika.com/v1/coins")
    .then((r2) => {
      console.log(JSON.parse(r2.target.responseText), "this is r2");
      let response = JSON.parse(r2.target.responseText);
      checkAllId(response);
    })
    .catch();
});

function checkAllId(array) {
  for (let i = 0; i < array.length; i++) {
    if (search.value === array[i].id) {
      request(
        "GET",
        `https://api.coinpaprika.com/v1/coins/${search.value}/twitter`
      ) //Gets tweets related to the cryptocurrency
        .then((r1) => {
          let response = JSON.parse(r1.target.responseText);
          displayTweets(response); //pass in response which is an object of arrays to displayTweets function which will show all the tweets inside of a div.
        })
        .catch();
      // displayTweets(array)
    } else {
      console.log("nope");
    }
  }
}

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
