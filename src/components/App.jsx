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
    const inputForSearch = evt.target.elements.inputForSearch;
    if (inputForSearch.value.trim() === '') return;
    this.setState({
      currentSearch: inputForSearch.value,
      page: 1,
      isLoading: true,
    });
  };

  handleClickMore = async () => {
    this.setState({
      page: this.state.page + 1,     
      isLoading: true,
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

  async componentDidUpdate(_, prevState) {  //_  -  заміна пустому prevProps
    
    if (this.state.currentSearch === prevState.currentSearch
      && this.state.page === prevState.page) return;
    
    if (this.state.currentSearch !== prevState.currentSearch) {
      if (this.state.currentSearch.trim() === '') {
        this.setState({ isLoading: false })
        return
      } else {
        this.setState({ isLoading: true }); 
      }
        
      const response = await fetchImages(this.state.currentSearch, 1);
      this.setState({
        images: response,
        isLoading: false,
        page: 1,
      });
    }
    
    if (this.state.page !== prevState.page) {
      const response = await fetchImages(
        this.state.currentSearch,
        this.state.page
      );
      this.setState({
        images: [...this.state.images, ...response],
        isLoading: false,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    localStorage.removeItem('totalHits');
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
            {this.state.images.length > 0 &&
                Math.ceil(localStorage.getItem('totalHits') / 12) > this.state.page ? (
              <Button onClick={this.handleClickMore} />
            ) : null}
              {/* <p>Сторінка {this.state.page} з {Math.ceil(localStorage.getItem('totalHits') / 12)} </p> */}
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
