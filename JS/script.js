//Fetch api
const BASE_URL = "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-2020s.json";
let allMovies;
const fetchMovies = async () => {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) {
            throw new Error("Ops, noe gikk feil med hentingen.");
        }
        const data = await res.json();
        allMovies=data
        
        
       
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


