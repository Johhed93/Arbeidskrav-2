//Fetch api
const BASE_URL = "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-2020s.json";

const fetchMovies = async () => {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) {
            throw new Error("Ops, noe gikk feil med hentingen.");
        }
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.error(error);
    }
};

fetchMovies();





//Fetch inputtypes
const findMovieInput = document.querySelector('#findMovieInput')
const rangeYearInput = document.querySelector('#rangeYear')


//Fetch knapper
const randomMovieBtn = document.querySelector('#randomMovieBtn');
const findMovieBtn = document.querySelector('#findMovieBtn');
const addMovieBtn = document.querySelector('#addMovieBtn');
const deleteMovieBtn = document.querySelector('#deleteMovieBtn');
const sortMovieGenre = document.querySelector('#sortMovieGenre')



//Fetch movielist-div
const movielist = document.querySelector('#movielist');

//Fetch rangeYearData
const rangeYearData = document.querySelector('#rangeYearData')


//Layout nettside 

//Find movie

//Add movie to movie library

//Delete movie from library

//Sort movie release year 


//Choose random movie function

//Choose movie genre 


//Local storage 


