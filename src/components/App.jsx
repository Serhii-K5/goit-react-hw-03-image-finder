import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './api/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import cssApp from './App.module.css'
import cssLoader from './Loader/Loader.module.css';

export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    currentSearch: '',
    page: 1,
    isModalOpen: false,
    modalImg: '',
    modalAlt: '',
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    const inputForSearch = evt.target.elements.inputForSearch;
    if (inputForSearch.value.trim() === '') {
      this.setState({ isLoading: false })
      return alert("No data to search");
    }
    const response = await fetchImages(inputForSearch.value, 1);
    this.setState({
      images: response,
      isLoading: false,
      currentSearch: inputForSearch.value,
      page: 1,
    });
  };

  handleClickMore = async () => {
    const response = await fetchImages(
      this.state.currentSearch,
      this.state.page + 1
    );
    this.setState({
      images: [...this.state.images, ...response],
      page: this.state.page + 1,
    });
  };

  handleImageClick = evt => {
    this.setState({
      isModalOpen: true,
      modalAlt: evt.target.alt,
      modalImg: evt.target.name,
    });
  };

  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
      modalImg: '',
      modalAlt: '',
    });
  };

  handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      this.handleModalClose();
    }
  };

  async componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <div className={cssApp.App}>
        {this.state.isLoading ? (
          <div className={cssLoader.loader}>
            <Loader />
          </div>
        ) : (
          <React.Fragment>
            <Searchbar onSubmit={this.handleSubmit} />
            <ImageGallery
              onImageClick={this.handleImageClick}
              images={this.state.images}
            />
            {this.state.images.length > 0 ? (
              <Button onClick={this.handleClickMore} />
            ) : null}
          </React.Fragment>
        )}
        {this.state.isModalOpen ? (
          <Modal
            src={this.state.modalImg}
            alt={this.state.modalAlt}
            handleClose={this.handleModalClose}
          />
        ) : null}
      </div>
    );
  }
}
