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
    const movies = allMovies.forEach(movie => {
            showMovies(movie.title, movie.thumbnail, movie.year);
        });
  } catch (error) {
    console.error(error);
  }
};

fetchMovies();

//Fetch movielist-div
const movielistContainer = document.getElementById("movielistContainer");

//Show movies
const showMovies = (title, img, year) => {
    const divContainer = document.createElement("div");
    const divTitleContainer = document.createElement("div");
    const image = document.createElement("img");
    const titleText = document.createElement("p");
    const yearText = document.createElement("p");
    divContainer.style.display = "flex";
    divContainer.style.alignItems = "center";
    divContainer.style.justifyContent = "space-between";
    divContainer.style.flexFlow = "column wrap";
    divContainer.style.border = "2px solid gray";
    divContainer.style.borderRadius = "5px";
    divTitleContainer.style.display = "flex";
    divTitleContainer.style.width = "180px";
    divTitleContainer.style.justifyContent = "center";
    divTitleContainer.style.textAlign = "center";
   
    if (!img) {
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
    } else {
        image.src = img;
    }
    image.alt = title + "-cover";
    image.style.height = "300px";
    image.style.width = "200px";
    image.style.objectFit = "cover";
    titleText.innerHTML = title;
    titleText.style.fontFamily = "Mongolian Baiti, Times New Roman, serif";
    titleText.style.fontSize = "1.7rem";
    titleText.style.margin = "10px 0";
    yearText.innerHTML = year;
    yearText.style.fontSize = "1rem";
    yearText.style.marginBottom = "10px";
    yearText.style.color = "#595959";
    divContainer.appendChild(image);
    divTitleContainer.appendChild(titleText);
    divContainer.appendChild(divTitleContainer)
    divContainer.appendChild(yearText);
    movielistContainer.appendChild(divContainer);
}

//Filter year
const selectYearsForm = document.getElementById("selectYearsForm");
selectYearsForm.style.display = "none";
const showYearSelection = () => {
   if (selectYearsForm.style.display == "none") {
    selectYearsForm.style.display = "flex";
   } else {
    selectYearsForm.style.display = "none";
   }
};

// Filter Genre
const selectGenresForm = document.getElementById("selectGenresForm");
selectGenresForm.style.display = "none";
const showGenreSelection = () => {
   if (selectGenresForm.style.display == "none") {
    selectGenresForm.style.display = "flex";
   } else {
    selectGenresForm.style.display = "none";
   }
};

//Fetch inputtypes
const findMovieInput = document.querySelector("#findMovieInput");
const rangeYearInput = document.querySelector("#rangeYear");

//Fetch knapper
const randomMovieBtn = document.querySelector("#randomMovieBtn");
const addMovieBtn = document.querySelector("#addMovieBtn");
const deleteMovieBtn = document.querySelector("#deleteMovieBtn");
const sortMovieGenre = document.querySelector("#sortMovieGenre");

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
const saveData = () => {
  localStorage.setItem('data', movielist.innerHTML); //Lagrer innhold i movielist
}

const showData = () => {
  movielist.innerHTML = localStorage.getItem('data');
}
showData();