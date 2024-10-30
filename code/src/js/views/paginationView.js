import View from "./view.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".btn--inline");
      if (!button) return;
      const goToPage = +button.dataset.gotopage;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  _forwardPageMarkup(page) {
    return `
      <button data-goToPage=${
        page + 1
      } class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>`;
  }

  _backwardPageMarkup(page) {
    return `
      <button data-goToPage=${
        page - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
  `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log("number of pages", numberOfPages);

    //Page 1,and there are other pages
    if (currentPage === 1 && numberOfPages > 1) {
      return this._forwardPageMarkup(currentPage);
    }

    //last page
    if (this._data.page === numberOfPages && numberOfPages > 1) {
      return this._backwardPageMarkup(currentPage);
    }

    //Other page
    if (this._data.page < numberOfPages) {
      const backwardPageMarkup = this._backwardPageMarkup(currentPage);
      const forwardPageMarkup = this._forwardPageMarkup(currentPage);
      return `${backwardPageMarkup} ${forwardPageMarkup}`;
    }

    //Page 1, and no other pages
    if (this._data.page === 1 && numberOfPages === 1) {
      return "";
    }
  }
}

export default new PaginationView();
