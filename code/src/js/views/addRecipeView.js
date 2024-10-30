import View from "./view.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _successMessage = "Recipe was successfully created!!";

  _addRecipeFormWindow = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    //created constructor here because addHandlerShowAddRecipeWindow() doesn't need controller to call ie it's not depended on controller, so will call in the constructor
    super(); //since AddRecipeView is a child class of View Class, we can use this keyword only after the super() keyword
    this._addHandlerShowAddRecipeWindow();
    this._addHandlerCloseAddRecipeWindow();
  }

  _toggleClass() {
    this._overlay.classList.toggle("hidden");
    this._addRecipeFormWindow.classList.toggle("hidden");
  }

  _addHandlerShowAddRecipeWindow() {
    this._btnOpen.addEventListener("click", this._toggleClass.bind(this));
  }

  _addHandlerCloseAddRecipeWindow() {
    this._btnClose.addEventListener("click", this._toggleClass.bind(this));
    this._overlay.addEventListener("click", this._toggleClass.bind(this));
  }

  addHandlerCreateRecipe(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const formDataArray = [...new FormData(this)];
      const formData = Object.fromEntries(formDataArray);
      console.log("formData", formData);
      handler(formData);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
