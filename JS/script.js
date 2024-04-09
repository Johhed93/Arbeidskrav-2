//Fetch api

const BASE_URL =
  "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-2020s.json";
let allMovies;
const fetchMovies = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("Ops, noe gikk feil med hentingen.");

    }
    const data = await res.json();
    allMovies = data;
  } catch (error) {
    console.error(error);
  }
};

fetchMovies();

//Fetch inputtypes
const findMovieInput = document.querySelector("#findMovieInput");
const rangeYearInput = document.querySelector("#rangeYear");

//Fetch knapper
const randomMovieBtn = document.querySelector("#randomMovieBtn");
const addMovieBtn = document.querySelector("#addMovieBtn");
const deleteMovieBtn = document.querySelector("#deleteMovieBtn");
const sortMovieGenre = document.querySelector("#sortMovieGenre");

//Fetch movielist-div
const movielist = document.querySelector("#movielist");

//Fetch rangeYearData
const rangeYearData = document.querySelector("#rangeYearData");

//Layout nettside 

//Find movie
    const findMovie = () => {
        const inputValue = findMovieInput.value.toLowerCase();
        const foundMovies = allMovies.filter(
          (movie) => movie.title.toLowerCase().includes(inputValue)
        );
      
        
      
        if (foundMovies.length > 0) {
          foundMovies.forEach(movie => {
            console.log(movie.title);
          });
        } else {
          console.log("Fant ikke film. Søk igjen");
        }
      };
      
      findMovieInput.addEventListener("input", findMovie);
      
      

//Add movie to movie library

//Delete movie from library

//Sort movie release year
const showReleaseYear=()=>{
  const allYears= allMovies.map(movie=>movie.year);
  return Array.from(new Set(allYears))
}
const chooseReleaseYear=(value)=>{
return allMovies.filter(movie=>movie.year===value)
}
//Choose random movie function
const randomMovie= ()=>{
    const randomNumber= Math.floor(Math.random()*allMovies.length);
    return allMovies[randomNumber]
}
randomMovieBtn.addEventListener("click", ()=>{
console.log(randomMovie())
})


//Choose movie genre 
const allMovieGenre= ()=>{
    const findGenres= allMovies.flatMap(movie=>  movie.genres)
    let allGenres=Array.from(new Set(findGenres))
    return allGenres
}
const chooseMovieGenre= (value)=>{
    
    let choosenGenre= allMovies.filter(movie=>{
        return movie.genres.includes(value)
    })
    return choosenGenre
}


//Local storage
const saveData = (object) => {
  localStorage.setItem('data', object); //Lagrer innhold i movielist
}

const showData = () => {
  movielist.innerHTML = localStorage.getItem('data');
}
showData();