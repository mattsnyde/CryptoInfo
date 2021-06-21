**Crypto Info V1.0.0** 
----------------------------------------------------------------------------------------
This is the first version of the crypto information web application with atleast 1 if not more versions to proceed.

The application is built completely with HTML, CSS, Vanilla JS. 

The APIs powering the data displayed are the following
  1. https://coinpaprika.com/api/
  2. https://coinmarketcap.com/api/
----------------------------------------------------------------------------------------
**Home Page**
-----------------------------------------------------------------------------------
The data on the homepage is powered by the coinmarketcap api

The homepage displays the top 500 coins ranked by market cap, the information displayed in the table are, the market cap rank, the coin symbol, the coin name, the market cap, the all time high, the current price, as well as volume over 24hrs

Looking towards the top of the page theiir are divs that contain current time, defi-token-market-cap, alt-token-market-cap, stable-token-market-cap, -total-token-market-cap, total-token-volume-24hrs, which are all powered by the coinmarket api as well

Looking above the table their is an input field and 3 buttons, the input field allows the user to search by token-market-cap-rank, token-name, token-symbol, this will clear the entire table and will only display the users result, if what the user typed is incorrect the table will remain the same. 

There is a button called Watch List and what this is, is a table that is hidden unless the button is clicked, the user is able to add whatever tokens they want to this watch list by clicking on the rows of the main table, duplicates are not displayed. This is done with CRUD operations

At this time the only way for the user to remove tokens from their watchlist is by the clear watchList button which will remove the entire table.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Social Arbitration**
----------------------------------------------------------------------------------
The data on this page is powered by the coinpaprika api

This page contains 1 input field and 1 button and that is all, the user is type a coin_id into the search field such as doge-dogecoin and press the search button

Performing the operation above a maximum of 50 tweets related to the coin the user is looking for will be displayed, these tweets all contain user profile picture, users name, message, and date posted. 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**What will be changed in the near future**
-------------------------------------------------------------------------
  1. I will be adding a historical data functionality which will be inside of the chart tab that is currently shown now
     This will definitely be powered by an api and the goal is to be able to display the historicial data of a token the user searches and preferably this data would go back a week minimum
     
  2. I will be adding a news feature inside of the news tab that is currently shown in the menu
    This will definitely be api drive and the goal is to display any news about cryptocurrencies
    
  3. I plan on redocing the social arbitration with more features and more recent information such as trends also I would preferably de displaying data from multiple sources such as reddit, twitter, instagram, etc.
    This will be api driven and the goal is to provide the user with what tokens have the most social sentimate behind them at the current time. 
 
