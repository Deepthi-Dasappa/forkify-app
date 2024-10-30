import View from "./view.js";
import previewView from "./previewView.js";
import icons from "../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "No recipe for your query was found. Please try for an other recipe";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((result) => {
        return previewView.render(result, false);
      })
      .join("");
  }
}

export default new ResultsView();
