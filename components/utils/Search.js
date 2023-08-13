import classes from "./Search.module.css";

function Search() {
  return (
    <div
      className={`${classes["search-container"]} base-container`}
      id="search-form-container"
    >
      <div className={`${classes["search-container__inner"]}`}>
        <form
          action=""
          className={`${classes["search-container__inner_form"]}`}
        >
          <input
            className={`${classes["search-container__inner_form-input"]}`}
            type="text"
            placeholder="What are you looking for?"
          />
          <button
            className={`btn ${classes["search-container__inner_form-btn"]}`}
            type="submit"
          >
            <i className="ri-search-line"></i>
          </button>
        </form>
        <span className={`${classes["search-container__inner_note"]}`}>
          Or press ESC to close.
        </span>
      </div>

      <button
        className={`btn ${classes["form-close-btn"]} place-items-center`}
        id="form-close-btn"
      >
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
}

export default Search;
