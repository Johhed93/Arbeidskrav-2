//Fetch api

const BASE_URL =
  "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-2020s.json";
  const USERBASE_URL = "https://crudapi.co.uk/api/v1/user";
  const API_KEY = "XgZAbMaJMOh5JZMo8gqNs8I__snYynl3o_H7dtDrhIfBClHGcQ";
  const getHeaders = (apiKey) => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  };
  const getLoggedInUser = () => {
    return JSON.parse(sessionStorage.getItem("loggedInUser"));
  };
let allMovies;
const fetchMovies = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("Ops, noe gikk feil med hentingen.");
    }
    const data = await res.json();
    allMovies = data;
    sortInAlphabeticalOrder().forEach((movie) => {
      showMovies(movie);
    });
  } catch (error) {
    console.error(error);
  }
};

fetchMovies();

//Fetch movielist-div
const movielistContainer = document.getElementById("movielistContainer");
const myWatchList = document.querySelector("#myWatchList");

//Show movies
const showMovies = (movie) => {
  const divContainer = document.createElement("div");

  divContainer.addEventListener("click", () => {
    overlay.innerHTML = "";
    showSpecificMovie(movie);
  });
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

  if (!movie.thumbnail) {
    image.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  } else {
    image.src = movie.thumbnail;
  }
  image.alt = movie.title + "-cover";
  image.style.height = "300px";
  image.style.width = "200px";
  image.style.objectFit = "cover";
  image.onerror = () => {
    image.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  };
  titleText.innerHTML = movie.title;
  titleText.style.fontFamily = "Mongolian Baiti, Times New Roman, serif";
  titleText.style.fontSize = "1.7rem";
  titleText.style.margin = "10px 0";
  yearText.innerHTML = movie.year;
  yearText.style.fontSize = "1rem";
  yearText.style.marginBottom = "10px";
  yearText.style.color = "#595959";
  divContainer.appendChild(image);
  divTitleContainer.appendChild(titleText);
  divContainer.appendChild(divTitleContainer);
  divContainer.appendChild(yearText);
  movielistContainer.appendChild(divContainer);
};

//Filter release year
const selectYearsForm = document.getElementById("selectYearsForm");
selectYearsForm.style.display = "none";
let i = 0;
const showYearSelection = () => {
  if (selectYearsForm.style.display == "none") {
    if (i === 0) {
      showReleaseYear();
      i += 1;
    }
    selectYearsForm.style.display = "flex";
  } else {
    selectYearsForm.style.display = "none";
  }
};

//Sort movie release year
const showReleaseYear = () => {
  const allYears = allMovies.map((movie) => movie.year);
  let uniqueYears = Array.from(new Set(allYears));
  uniqueYears.sort();
  uniqueYears.unshift("Alle år");
  uniqueYears.forEach((year) => {
    displayFilteredMovies(year, "years");
  });
};

let b = 0;
let c = 0;

const displayFilteredMovies = (inpValue, type) => {
  const yearContainer = document.createElement("div");
  const yearInput = document.createElement("input");
  const yearLabel = document.createElement("label");
  yearContainer.classList.add("yearContainer");
  yearInput.type = "radio";
  yearInput.id = "filter" + inpValue;
  yearInput.class = type + "RadioBtn";
  yearInput.name = "filter" + type;
  yearInput.value = inpValue;
  if (type === "years") {
    if (b === 0) {
      yearInput.checked = true;
      b += 1;
    }
  } else {
    if (c === 0) {
      yearInput.checked = true;
      c += 1;
    }
  }
  yearInput.addEventListener("click", () => {
    let radioYearBtns = document.getElementsByName("filteryears");
    let radioYearBtnsArray = Array.from(radioYearBtns);
    let radioGenreBtns = document.getElementsByName("filtergenres");
    let radioGenreBtnsArray = Array.from(radioGenreBtns);
    radioGenreBtnsArray.forEach((genreRadio) => {
      if (genreRadio.checked === true) {
        if (radioYearBtnsArray.length === 0) {
          if (genreRadio.value === "Alle sjangre") {
            movielistContainer.innerHTML = "";
            allMovies.forEach((movie) => showMovies(movie));
          } else {
            let filteredMovies = chooseMovieGenre(genreRadio.value);
            movielistContainer.innerHTML = "";
            filteredMovies.forEach((movie) => showMovies(movie));
          }
        }
      }
    });
    radioYearBtnsArray.forEach((yearRadio) => {
      if (yearRadio.checked === true) {
        if (radioGenreBtnsArray.length === 0) {
          if (yearRadio.value === "Alle år") {
            movielistContainer.innerHTML = "";
            allMovies.forEach((movie) => showMovies(movie));
          } else {
            let filteredMovies = chooseReleaseYear(yearRadio.value);
            movielistContainer.innerHTML = "";
            filteredMovies.forEach((movie) => showMovies(movie));
          }
        } else if (yearRadio.value === "Alle år") {
          radioGenreBtnsArray.forEach((genreRadio) => {
            if (genreRadio.checked === true) {
              if (genreRadio.value === "Alle sjangre") {
                movielistContainer.innerHTML = "";
                allMovies.forEach((movie) => showMovies(movie));
              } else {
                let choosenGenre = allMovies.filter((movie) => {
                  return movie.genres.includes(genreRadio.value);
                });
                movielistContainer.innerHTML = "";
                choosenGenre.forEach((movie) => showMovies(movie));
              }
            }
          });
        } else {
          let filteredMovies = chooseReleaseYear(yearRadio.value);
          radioGenreBtnsArray.forEach((genreRadio) => {
            if (genreRadio.checked === true) {
              if (genreRadio.value === "Alle sjangre") {
                movielistContainer.innerHTML = "";
                filteredMovies.forEach((movie) => showMovies(movie));
              } else {
                let choosenGenre = filteredMovies.filter((movie) => {
                  return movie.genres.includes(genreRadio.value);
                });
                movielistContainer.innerHTML = "";
                choosenGenre.forEach((movie) => showMovies(movie));
              }
            }
          });
        }
      }
    });
  });
  yearInput.classList.add("radio");
  yearLabel.for = "filter" + inpValue;
  yearLabel.innerHTML = inpValue;
  yearContainer.appendChild(yearInput);
  yearContainer.appendChild(yearLabel);
  if (type === "years") {
    selectYearsForm.appendChild(yearContainer);
  } else if (type === "genres") {
    selectGenresForm.appendChild(yearContainer);
  }
};

const chooseReleaseYear = (value) => {
  value = Number(value);
  return allMovies.filter((movie) => movie.year === value);
};

// Filter Genre
const selectGenresForm = document.getElementById("selectGenresForm");
selectGenresForm.style.display = "none";
let j = 0;
const showGenreSelection = () => {
  if (selectGenresForm.style.display == "none") {
    if (j === 0) {
      top10MovieGenre();
      j += 1;
    }
    selectGenresForm.style.display = "flex";
  } else {
    selectGenresForm.style.display = "none";
  }
};

//Fetch inputtypes
const findMovieInput = document.querySelector("#findMovieInput");
const rangeYearInput = document.querySelector("#rangeYear");

//Fetch overlay
const overlay = document.querySelector("#overlay");

//Fetch knapper
const randomMovieBtn = document.querySelector("#randomMovieBtn");
const addMovieBtn = document.querySelector("#addMovieBtn");
const deleteMovieBtn = document.querySelector("#deleteMovieBtn");
const sortMovieGenre = document.querySelector("#sortMovieGenre");

//Fetch rangeYearData
const rangeYearData = document.querySelector("#rangeYearData");

//Find movie
const findMovie = () => {
  const inputValue = findMovieInput.value.toLowerCase();
  const foundMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(inputValue)
  );

  if (foundMovies.length > 0) {
    movielistContainer.innerHTML = "";
    foundMovies.forEach((movie) => {
      showMovies(movie);
    });
  }
};

findMovieInput.addEventListener("input", findMovie);

//Add movie to movie library

//Choose random movie function
const randomMovie = () => {
  const randomNumber = Math.floor(Math.random() * allMovies.length);
  return allMovies[randomNumber];
};
randomMovieBtn.addEventListener("click", () => {
  overlay.innerHTML = "";
  showSpecificMovie(randomMovie());
});

//Choose movie genre
const top10MovieGenre = () => {
  const findGenres = allMovies.flatMap((movie) => movie.genres);
  let genreObject = [];
  findGenres.forEach((genre) => {
    if (!genreObject[genre]) {
      genreObject[genre] = [];
    }
    genreObject[genre].push(genre);
  });

  let sortedGenres = Object.entries(genreObject).sort((a, b) => {
    return b[1].length - a[1].length;
  });
  sortedGenres.splice(10);
  sortedGenres.forEach((genre) => {
    genre.splice(1);
  });
  let mostCommonGenres = [].concat.apply([], sortedGenres);
  mostCommonGenres.unshift("Alle sjangre");
  mostCommonGenres.forEach((genre) => {
    displayFilteredMovies(genre, "genres");
  });
};

const chooseMovieGenre = (value) => {
  let choosenGenre = allMovies.filter((movie) => {
    return movie.genres.includes(value);
  });
  return choosenGenre;
};

//Local storage
const checkIfMovieExist=async(object)=>{
  try{
    const res= await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
      method:"GET",
      headers:getHeaders(API_KEY)
    })
    const data=await res.json();
    return data.myMovies.some(movie=>movie.title===object.title)

  }catch(error){
    console.error("Något blev fel i kontrollering om filmen fanns", error)
  }
}
const addToWatchList = async (object) => {
  let user;
  try{
    if(await checkIfMovieExist(object)){
      return alert("Denna filmen finns redan i dine filmer")
    }
     const res=await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
      method:"GET",
      headers:getHeaders(API_KEY)
    })
    const data= await res.json();
    user=data
  }
  catch(error){
  console.error("Error något blev fel att hente information till brukern ved legga till film", error)
  }
  try{
    const updatedUser={
      username:user.username,
      password:user.password,
      myMovies:user.myMovies
    }
    updatedUser.myMovies.push(object)
    const res= await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
      method:"PUT",
      headers:getHeaders(API_KEY),
      body:JSON.stringify(updatedUser)
    })
    if(!res.ok){
      throw new Error("Något blev fel i att legga till film", res.status)
    }
  }catch(error){
    console.error("Något blev fel med att legga till filmen")
  }
 
};



//Sort movie by letter in the alphabet
const sortInAlphabeticalOrder = () => {
  return allMovies.sort((a, b) => a.title.localeCompare(b.title));
};

const showSpecificMovie = (movie) => {
  const divTitleContainer = document.createElement("div");
  const image = document.createElement("img");
  const titleText = document.createElement("p");
  const yearText = document.createElement("p");
  const movieDescripton = document.createElement("p");
  const actors = document.createElement("p");

  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "space-evenly";
  overlay.style.flexFlow = "flexrow wrap";
  overlay.style.border = "2px solid gray";
  overlay.style.borderRadius = "5px";
  overlay.style.backgroundColor = "#FFE97A";

  divTitleContainer.style.display = "flex";
  divTitleContainer.style.width = "600px";
  divTitleContainer.style.flexFlow = "column";
  divTitleContainer.style.justifyContent = "center";
  divTitleContainer.style.textAlign = "center";
  divTitleContainer.style.marginRight = "15px";
  divTitleContainer.style.paddingBottom = "45px";

  if (!movie.thumbnail) {
    image.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  } else {
    image.src = movie.thumbnail;
  }
  image.alt = movie.title + "-cover";
  image.style.height = "400px";
  image.style.width = "250px";
  image.style.objectFit = "cover";
  image.onerror = () => {
    image.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  };

  titleText.innerHTML = movie.title;
  titleText.style.fontFamily = "Mongolian Baiti, Times New Roman, serif";
  titleText.style.fontSize = "1.7rem";
  titleText.style.margin = "10px 0";

  yearText.innerHTML = movie.year;
  yearText.style.fontSize = "0.8rem";
  yearText.style.marginBottom = "10px";
  yearText.style.color = "#595959";

  movieDescripton.innerHTML = `Plot: ${movie.extract}`;
  movieDescripton.style.fontSize = "1rem";

  actors.innerHTML = `Cast: ${movie.cast}`;
  actors.style.padding = "15px";
  actors.style.fontSize = "0.8rem";

  //Close window button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
  closeBtn.style.padding = "10px";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "5px";
  closeBtn.style.right = "5px";



  
  //addButton to movielist
  const addBtn = document.createElement("button");

  addBtn.style.display = "flex";
  addBtn.style.alignItems = "center";
  addBtn.style.padding = "2px";
  addBtn.style.paddingInline = "20px";
  addBtn.style.position = "absolute";
  addBtn.style.bottom = "10px";
  addBtn.style.left = "10px";
  addBtn.style.borderRadius = "15px";
  addBtn.style.backgroundColor = "#FF9898";

  const addBtnImage = document.createElement("img");
  addBtnImage.src = "./assets/addToListIcon.png";
  addBtnImage.style.width = "30px";
  addBtnImage.style.height = "30px";
  addBtn.appendChild(addBtnImage);

  addBtn.appendChild(document.createTextNode("Legg til i ønsket sett"));

  divTitleContainer.appendChild(titleText);
  overlay.appendChild(divTitleContainer);
  divTitleContainer.appendChild(yearText);
  divTitleContainer.appendChild(movieDescripton);
  overlay.appendChild(image);
  divTitleContainer.appendChild(actors);
  overlay.appendChild(closeBtn);
  overlay.appendChild(addBtn);
  movielistContainer.appendChild(overlay);

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  addBtn.addEventListener("click", () => {
    addToWatchList(movie);
    overlay.style.display = "none";
  });
};
