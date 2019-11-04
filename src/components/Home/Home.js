import React from 'react'
import './Home.css'
import HeroImage from '../elements/HeroImage/HeroImage'
import SearchBar from '../elements/SearchBar/SearchBar'
import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '../../config'

class Home extends React.Component {
  //props is use to transport data down to the component
  //to render props from alpha in beta {this.props.fromAlpha}
  //state is where the data lives in the component, when state is updated the component is render anew
  //state is immutable, use this.setState() function only, copy and update states by copy update
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ''
  }
  //don't forget to Use ` instead of ', throws error curly_bracing
  componentDidMount() {
    console.log('componentDidMount');
    this.setState({ loading: true });
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchItems(endpoint);

  }
  //set function to pass to searchBar component
  searchItems = (searchTerm) => {
    let endpoint = '';
    this.setState({
      movies: [],
      loading: true,
      searchTerm: searchTerm,
    })
    if (searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
  }

  loadMoreItems = () => {
    let endpoint = '';
    this.setState({ loading: true })
    if (this.state.searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
    }
    else {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
    }
    this.fetchItems(endpoint);
  }

  //arrow function to get data from the api
  fetchItems = (endpoint) => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        this.setState({
          //using ... ES6 spread syntax, get the old state  movie and the append result with ..., results gets from json Key
          movie: [...this.state.movies, ...result.results],
          heroImage: this.state.heroImage || result.results[0],
          //set loading to false cause we don't fecth data anymore
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        });
        console.log(result);

      })
  }

  //old way below
  // constructor(){
  //     super(props)
  //     state = {
  //     } 
  // }


  // class component must have render
  //use {} for javascript inside
  render() {
    console.log('rendering');
    return (
      <div className="rmdb-home">
        {/* check if there's a heroImage loader with ternary operator before rendering */}
        {this.state.heroImage ?
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
              title={this.state.heroImage.original_title}
              text={this.state.heroImage.overview}
            />
            <SearchBar callback={this.searchItems} />
          </div> : null}

      </div>
    )
  }
}
export default Home;