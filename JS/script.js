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
//Logged in
const setLoginstatus = (status) => {
  sessionStorage.setItem("loggedIn", status ? "true" : "false");
};
const loggedIn = () => {
  return sessionStorage.getItem("loggedIn") === "true";
};
const logOut= ()=>{
  setLoginstatus(false);
  sessionStorage.removeItem("loggedInUser");
  location.reload();
}

// Sjekker om brukeren er logget på
const checkLoggedInStatus = () => {
  const loginListPoint = document.getElementById("loginListPoint");
  if (loggedIn()) {
    //Hvis ja, vis "Logg ut"
    let button= document.createElement("button");
    button.style.background="none";
    button.style.outline="none";
    button.style.border="none";
    button.innerText="Logg ut";
    button.style.fontSize="inherit"
    button.style.fontWeight = 'bold';
    button.addEventListener("click", logOut)
    loginListPoint.appendChild(button)
  } else {
    // Hvis nei, vis "Logg inn"
    loginListPoint.innerHTML = `<a href="login.html" id="login">Logg inn</a>`;
  }
};

checkLoggedInStatus();

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
  divContainer.style.zIndex = "1";
  divContainer.style.backgroundColor = "white";
  divContainer.style.border = "2px solid black";
  divContainer.style.borderRadius = "5px";
  divContainer.style.cursor = "pointer";
  divContainer.style.boxShadow =
    "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px";
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

  //Animations

  divContainer.addEventListener("mouseover", () => {
    divContainer.style.transform = "scale(1.1)";
    divContainer.style.borderColor = "red";
    divContainer.style.zIndex = "5";
    divContainer.style.transition = "all 1s";
  });

  divContainer.addEventListener("mouseleave", () => {
    divContainer.style.transform = "scale(1.0)";
    divContainer.style.zIndex = "1";
    divContainer.style.borderColor = "inherit";
  });

  divContainer.appendChild(image);
  divTitleContainer.appendChild(titleText);
  divContainer.appendChild(divTitleContainer);
  divContainer.appendChild(yearText);
  movielistContainer.appendChild(divContainer);
};

//Reveal release year filter
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

// Choose release year
const chooseReleaseYear = (value) => {
  value = Number(value);
  return allMovies.filter((movie) => movie.year === value);
};

//Reveal genre filter
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

// Sort movie genre
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

//Choose movie genre
const chooseMovieGenre = (value) => {
  let choosenGenre = allMovies.filter((movie) => {
    return movie.genres.includes(value);
  });
  return choosenGenre;
};

//Show filters and filter movies
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
  selectYearsForm.style.zIndex = "10"; //For å få i front
  selectGenresForm.style.zIndex = "10"; //For å få i front

  if (type === "years") {
    selectYearsForm.appendChild(yearContainer);
  } else if (type === "genres") {
    selectGenresForm.appendChild(yearContainer);
  }
};

//Fetch overlay
const overlay = document.querySelector("#overlay");

//Fetch knapper
const randomMovieBtn = document.querySelector("#randomMovieBtn");
const sortMovieGenre = document.querySelector("#sortMovieGenre");

//Find movie
const findMovieInput = document.querySelector("#findMovieInput");

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

//Choose random movie function
const randomMovie = () => {
  const randomNumber = Math.floor(Math.random() * allMovies.length);
  return allMovies[randomNumber];
};
randomMovieBtn.addEventListener("click", () => {
  overlay.innerHTML = "";
  showSpecificMovie(randomMovie());
});

//Local storage
const checkIfMovieExist = async (object) => {
  try {
    const res = await fetch(`${USERBASE_URL}/${getLoggedInUser()}`, {
      method: "GET",
      headers: getHeaders(API_KEY),
    });
    const data = await res.json();
    return data.myMovies.some((movie) => movie.title === object.title);
  } catch (error) {
    console.error("Något blev fel i kontrollering om filmen fanns", error);
  }
};
const addToWatchList = async (object) => {
  let user;
  try {
    if (await checkIfMovieExist(object)) {
      return alert("Denna filmen finns redan i dine filmer");
    }
    const res = await fetch(`${USERBASE_URL}/${getLoggedInUser()}`, {
      method: "GET",
      headers: getHeaders(API_KEY),
    });
    const data = await res.json();
    user = data;
  } catch (error) {
    console.error(
      "Error något blev fel att hente information till brukern ved legga till film",
      error
    );
  }
  try {
    const updatedUser = {
      username: user.username,
      password: user.password,
      myMovies: user.myMovies,
    };
    updatedUser.myMovies.push(object);
    const res = await fetch(`${USERBASE_URL}/${getLoggedInUser()}`, {
      method: "PUT",
      headers: getHeaders(API_KEY),
      body: JSON.stringify(updatedUser),
    });
    if (!res.ok) {
      throw new Error("Något blev fel i att legga till film", res.status);
    }
  } catch (error) {
    console.error("Något blev fel med att legga till filmen");
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
  overlay.style.zIndex = "7";
  overlay.style.border = "2px solid gray";
  overlay.style.borderRadius = "5px";
  overlay.style.backgroundColor = "#FFE97A";

  divTitleContainer.style.display = "flex";
  divTitleContainer.style.width = "600px";
  divTitleContainer.style.flexFlow = "column";
  divTitleContainer.style.justifyContent = "center";
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
  titleText.style.textAlign = "center";

  yearText.innerHTML = movie.year;
  yearText.style.fontSize = "0.8rem";
  yearText.style.marginBottom = "20px";
  yearText.style.color = "#595959";
  yearText.style.textAlign = "center";

  if (movie.extract !== undefined) {
    movieDescripton.innerHTML = `Plot: ${movie.extract}`;
  } else {
    movieDescripton.innerHTML = `Plot: Det er dessverre ikke skrevet noe plot til denne filmen.`;
  }
  movieDescripton.style.fontSize = "1rem";

  actors.innerHTML = `Cast: ${movie.cast}`;
  actors.style.padding = "15px 0";
  actors.style.fontSize = "0.8rem";

  //Close window button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
  closeBtn.style.padding = "10px";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "5px";
  closeBtn.style.right = "5px";

  //Random movie button in overlay
  const randomMovieBtn = document.createElement("button");
  randomMovieBtn.textContent = "Tilfeldig film";
  randomMovieBtn.style.padding = "2px";
  randomMovieBtn.style.paddingInline = "12px";
  randomMovieBtn.style.position = "absolute";
  randomMovieBtn.style.bottom = "10px";
  randomMovieBtn.style.left = "250px";
  randomMovieBtn.style.borderRadius = "15px";
  randomMovieBtn.style.backgroundColor = "#FF9898";
  randomMovieBtn.style.width = "130px";
  randomMovieBtn.style.height = "40px";
  randomMovieBtn.style.fontFamily = "Arial Rounded MT, sans-serif";
  randomMovieBtn.style.fontSize = "1rem";

  randomMovieBtn.addEventListener("click", () => {
    overlay.innerHTML = "";
    showSpecificMovie(randomMovie());
  });

  divTitleContainer.appendChild(titleText);
  overlay.appendChild(divTitleContainer);
  divTitleContainer.appendChild(yearText);
  divTitleContainer.appendChild(movieDescripton);
  overlay.appendChild(image);
  divTitleContainer.appendChild(actors);
  overlay.appendChild(closeBtn);
  overlay.appendChild(randomMovieBtn);

  movielistContainer.appendChild(overlay);

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  if (loggedIn()) {
    const addBtn = document.createElement("button");

    addBtn.addEventListener("click", () => {
      addToWatchList(movie);
      showAddedStatus();

      overlay.style.display = "none";
    });

    addBtn.style.display = "flex";
    addBtn.style.alignItems = "center";
    addBtn.style.padding = "4px";
    addBtn.style.paddingInline = "12px";
    addBtn.style.position = "absolute";
    addBtn.style.bottom = "10px";
    addBtn.style.left = "10px";
    addBtn.style.borderRadius = "15px";
    addBtn.style.backgroundColor = "#FF9898";
    addBtn.style.fontFamily = "Arial Rounded MT, sans-serif";
    addBtn.style.fontSize = "1rem";

    const addBtnImage = document.createElement("img");
    addBtnImage.src = "./assets/addToListIcon.png";
    addBtnImage.style.width = "30px";
    addBtnImage.style.height = "30px";
    addBtn.appendChild(addBtnImage);

    addBtn.appendChild(document.createTextNode("Legg til i ønsket sett"));
    overlay.appendChild(addBtn);
  }
};
const showAddedStatus = () => {
  const addedMessage = document.getElementById("addedMessage");
  addedMessage.innerHTML = "";
  const infoText = document.createElement("p");
  addedMessage.style.position = "fixed";
  addedMessage.style.bottom = "20px";
  addedMessage.style.border = "2px solid black";
  addedMessage.style.borderRadius = "15px";
  addedMessage.style.background = "linear-gradient(to right, #d3cce3, #e9e4f0)";
  addedMessage.style.padding = "20px";
  addedMessage.style.zIndex = "6";
  addedMessage.style.opacity = "0";
  addedMessage.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
  infoText.innerHTML = "Filmen ble lagt til i min liste 😊";
  infoText.style.fontSize = "1rem";
  addedMessage.appendChild(infoText);
  //keyframes
  const showAddedMessasge = [
    { opacity: "0", left: "0px" },
    { opacity: "1", left: "30px", offset: 0.15 },
    { opacity: "1", left: "30px", offset: 0.93 },
    { opacity: "0", left: "30px" },
  ];
  //animation options
  const showMessageTiming = {
    duration: 6000,
    delay: 500,
  };
  addedMessage.animate(showAddedMessasge, showMessageTiming);
};
