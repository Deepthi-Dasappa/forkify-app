import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SECONDS } from "./config.js";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if (!recipeId) return;

    recipeView.renderSpinner();

    //update results view to mark selected search result, using renderOnlyUpdatedOne to avoid the flikering
    resultsView.renderOnlyUpdatedOne(model.getSearchResultsPage());

    bookmarksView.renderOnlyUpdatedOne(model.state.bookmarks);

    //Loading Recipe
    await model.loadRecipe(recipeId);

    //Rendering recipe
    recipeView.render(model.state.recipe);

    // debugger;
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1.Get search query
    const query = await searchView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.loadSearchResult(query);

    //3. Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  try {
    console.log("page controller");
    //1. Render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //2. Rendernew pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.renderOnlyUpdatedOne(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  console.log(model.state.recipe);

  //update recipe view
  recipeView.renderOnlyUpdatedOne(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipeData) {
  try {
    console.log("newRecipedata", newRecipeData);

    addRecipeView.renderSpinner();

    //upload the created recipe
    await model.uploadCreatedRecipe(newRecipeData);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //changeID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //close the window
    setTimeout(function () {
      addRecipeView._toggleClass();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerCreateRecipe(controlAddRecipe);
};

init();
