import icons from "../../img/icons.svg";

export default class View {
  _data;

  /**
   * @param {boolean} [render=true] if false returns the markup
   * @param {Object | Object[]} recipeDetails The data to be rendered
   * @returns {undefined | string} A markup string is returned if the render is false
   * @author Deepthi
   * */

  render(recipeDetails, render = true) {
    if (
      !recipeDetails ||
      (Array.isArray(recipeDetails) && recipeDetails.length === 0)
    )
      return this.renderError();

    this._data = recipeDetails;
    // console.log("this.data", this._data);
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderOnlyUpdatedOne(recipeDetails) {
    // if (
    //   !recipeDetails ||
    //   (Array.isArray(recipeDetails) && recipeDetails.length === 0)
    // )
    //   return this.renderError();

    this._data = recipeDetails;
    const newMarkup = this._generateMarkup();
    // console.log("newMarkup", newMarkup);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // console.log("newDOM", newDOM);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    // console.log("newElements", newElements);
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );
    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];

      //Updates changed text
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        currentElement.textContent = newElement.textContent;
      }

      //updates changed attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach((attribute) => {
          currentElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.textContent = "";
  }

  renderSpinner() {
    const showSpinner = `<div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
                </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", showSpinner);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `<div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
