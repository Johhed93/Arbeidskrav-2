const USERBASE_URL = "https://crudapi.co.uk/api/v1/user";
const API_KEY = "XgZAbMaJMOh5JZMo8gqNs8I__snYynl3o_H7dtDrhIfBClHGcQ";
//Hente från session storage
const getLoggedInUser = () => {
  return JSON.parse(sessionStorage.getItem("loggedInUser"));
};
const loggedIn = () => {
  return sessionStorage.getItem("loggedIn") === "true";
};
const getHeaders = (apiKey) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
};


//Hente data/Radera i myMovies arrayen
const myWatchList = document.querySelector("#myWatchList");

const getData = async() => {
  myWatchList.innerHTML="";
  if(loggedIn()){
    try{
      const res=await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
        method:"GET",
        headers:getHeaders(API_KEY)
      })
      const data= await res.json();
      
    data.myMovies.forEach((movie) => {
      showMyMovies(movie);
    });
  }
    catch(error){
    console.error("Något blev fel med henting av mine filmer", error)
    }
  }
  else{
    console.log("Här va det tomt")
  }
};
const deleteData = async(object) => {
   let user;
   try{
    const res=await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
      method:"GET",
      headers:getHeaders(API_KEY)
    })
    if(!res.ok){
      throw new Error("Något blev feil hos databasen på hente deletedata", res.status)
    }
    const data= await res.json();
    user=data
  }catch(error){
    console.error("något blev fel med att radera data", error)
  }
  try{
  const updatedList={
    username:user.username,
    password:user.password,
    myMovies:user.myMovies
  }
  let index= updatedList.myMovies.findIndex(user=> user.title===object.title)
  updatedList.myMovies.splice(index,1);

  const res=await fetch(`${USERBASE_URL}/${getLoggedInUser()}`,{
    method:"PUT",
    headers:getHeaders(API_KEY),
    body:JSON.stringify(updatedList)
  })
  if(!res.ok){
    throw new Error("Något blev feil put databasen deletedata", res.status)
  }
  await getData();
  }catch(error){
    console.error("Något blev fel med att radera data", error)
  }
  
};
const showMyMovies = async(movie) => {
  let container = document.createElement("li");
  container.style.display = "flex";
  container.style.gap = "10px";
  container.style.alignItems = "center";
  let movieInformation = document.createElement("div");
  movieInformation.style.width = "100%";
  movieInformation.style.border = "1px solid black";
  movieInformation.style.display = "flex";
  movieInformation.style.justifyContent = "space-between";
  movieInformation.style.alignItems = "center";

  let informationBox = document.createElement("div");
  informationBox.style.display = "flex";
  informationBox.style.alignItems = "center";
  informationBox.style.gap = "10px";
  let image = document.createElement("img");

  image.alt = `${movie.title} cover`;
  image.onerror = () => {
    this.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  };
  image.style.height = "300px";
  image.style.width = "150px";
  image.style.objectFit = "cover";
  if (!movie.thumbnail) {
    image.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  } else {
    image.src = movie.thumbnail;
  }
  informationBox.appendChild(image);

  let textbox = document.createElement("div");
  let title = document.createElement("h2");
  let year = document.createElement("p");
  title.innerHTML = movie.title;
  year.innerHTML = movie.year;
  title.style.fontSize = "2rem";

  textbox.appendChild(title);
  textbox.appendChild(year);

  let removeButton = document.createElement("button");
  removeButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  removeButton.style.border = "none";
  removeButton.style.outline = "none";
  removeButton.style.background = "none";
  removeButton.style.fontSize = "2.5rem";
  removeButton.style.paddingRight = "40px";
  removeButton.addEventListener("click", async()=>{
    await deleteData(movie)
  })

  informationBox.appendChild(textbox);
  movieInformation.appendChild(informationBox);
  movieInformation.appendChild(removeButton);
  container.appendChild(movieInformation);

  myWatchList.appendChild(container);
};
getData()