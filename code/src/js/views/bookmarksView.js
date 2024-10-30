import View from "./view.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage =
    "No recipe is bookmarked yet. Please find a nice recipe and bookmark it 😊 ";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => {
        return previewView.render(bookmark, false);
      })
      .join("");
  }
}

export default new BookmarksView();
