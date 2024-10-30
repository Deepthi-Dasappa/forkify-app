import { API_URL, RESULT_PER_PAGE, API_KEY } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }), //Nice trick to conditionally add properties to the object
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const data = await getJSON(`${API_URL}${recipeId}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
    // const { recipe } = data.data;

    // state.recipe = {
    //   cookingTime: recipe.cooking_time,
    //   id: recipe.id,
    //   image: recipe.image_url,
    //   ingredients: recipe.ingredients,
    //   publisher: recipe.publisher,
    //   servings: recipe.servings,
    //   sourceUrl: recipe.source_url,
    //   title: recipe.title,
    // };

    if (
      state.bookmarks.some((bookmark) => {
        return bookmark.id === recipeId;
      })
    )
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const { data } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        publisher: recipe.publisher,
        title: recipe.title,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmarks = function (recipe) {
  //Add bookmarks
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const deleteBookmarks = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => {
    return bookmark.id === id;
  });
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks(); //When you want to run this line of code then make sure to comment line 107 ie init()

export const uploadCreatedRecipe = async function (newRecipeData) {
  try {
    console.log(Object.entries(newRecipeData));
    const ingredients = Object.entries(newRecipeData)
      .filter((entry) => {
        return entry[0].startsWith("ingredient") && entry[1] !== "";
      })
      .map((ingredient) => {
        const ingredientArray = ingredient[1].split(",").map((element) => {
          return element.trim();
        });

        if (ingredientArray.length !== 3)
          throw new Error(
            "Wrong ingredient format. Please enter the correct format"
          );

        const [quantity, unit, description] = ingredientArray;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipeData.title,
      source_url: newRecipeData.sourceUrl,
      image_url: newRecipeData.image,
      publisher: newRecipeData.publisher,
      cooking_time: +newRecipeData.cookingTime,
      servings: +newRecipeData.servings,
      ingredients,
    };
    console.log("ingredients", ingredients);
    console.log("recipe", recipe);

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    console.log("data for the sent recipe ", data);

    state.recipe = createRecipeObject(data);

    addBookmarks(state.recipe);
  } catch (error) {
    throw error;
  }
};
