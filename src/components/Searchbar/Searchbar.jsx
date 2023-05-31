import propTypes from 'prop-types';
import css from './Searchbar.module.css';

export const Searchbar = ({ onSubmit }) => (
  <header className={css.Searchbar}>
    <form className={css.SearchForm} onSubmit={onSubmit}>
      

      <input
        name="inputForSearch"
        className={css.SearchFormInput}
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Enter data to search"
      />

      <button type="submit" className={css.SearchFormButton}>
        <span className={css.SearchFormButtonLabel}>Search</span>
      </button>
    </form>
  </header>
);

Searchbar.propTypes = {
  onSubmit: propTypes.func,
};