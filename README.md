# cmp-7027x-search-react


# flow:

* app.jsx
  * let user search 
  * on search use model type and user query 
  * make an axios call

* In the Node side, 
  * use the selected model to create embedding
  * do search with qdrant
  * get results and payload for all of them
  * return the result to UI

* In the UI, 
  * perform sentiment analysis on title
  * perform summary of each description
  * add that to the answer object
  * Show, 
    * matching score
    * sentiment and its score
    * summary 
    * url
    * full description in collapsable
 