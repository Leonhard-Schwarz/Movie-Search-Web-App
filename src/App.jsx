/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import MovieCard from "./MovieCard";
import "./App.css";
import SearchIcon from "./assets/search.svg";

const API_URL = "https://www.omdbapi.com/?apikey=4e3bcfc4";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const containerRef = useRef(null);

  const searchMovies = async (title, page) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      const data = await response.json();

      if (data.Response === "True") {
        if (page === 1) {
          setMovies(data.Search);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...data.Search]);
        }
        setTotalPages(Math.ceil(data.totalResults / 10)); // Assuming 10 results per page
        setError(null);
      } else {
        setError(data.Error);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setMovies([]);
    searchMovies(searchTerm, 1);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      searchMovies(searchTerm, nextPage);
      setCurrentPage(nextPage);
    }
  };

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      loadMore();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setError("Start by searching for movies.");
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="app">
      <h1>Movie Search App</h1>

      <div className="search">
        <input
          placeholder="Search for Movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img src={SearchIcon} alt="search" onClick={handleSearch} />
      </div>

      {error ? (
        <div className="empty">
          <h2>{error}</h2>
        </div>
      ) : (
        <div className="container" ref={containerRef}>
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
