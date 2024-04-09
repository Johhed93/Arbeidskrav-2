const deleteData= (object)=>{
    let watchList=JSON.parse(localStorage.getItem('data'));
    console.log(watchList)
    let index= watchList.findIndex(movie=>movie.title===object.title);
    console.log(index)
    watchList.splice(index,1);
    localStorage.setItem("data", JSON.stringify(watchList))
    
    showData()
  }
  const myWatchList= document.querySelector("#myWatchList")
  const showData=()=>{
    myWatchList.innerHTML=""
    let data= JSON.parse(localStorage.getItem("data"))
    
    data.forEach(movie => {
        showMyMovies(movie)
    });
  }

const showMyMovies= (movie)=>{
    
    let container=document.createElement("li");
    container.style.display="flex"
    container.style.gap="10px";
    container.style.alignItems="center"
    
    let confirmButton=document.createElement("button");
    confirmButton.innerHTML=`<i class="fa-regular fa-circle"></i>`
    confirmButton.style.border="none"
    confirmButton.style.outline="none"
    confirmButton.style.background="none"
    confirmButton.style.fontSize="2rem"
    container.appendChild(confirmButton);

    let movieInformation= document.createElement("div");
    movieInformation.style.width="100%"
    movieInformation.style.border="1px solid black"
    movieInformation.style.display="flex"
    movieInformation.style.justifyContent="space-between";
    movieInformation.style.alignItems="center"
    
    let informationBox= document.createElement("div");
    informationBox.style.display="flex"
    informationBox.style.alignItems="center"
    informationBox.style.gap="10px"
    let image= document.createElement("img")
    image.src=movie.thumbnail;
    image.alt=`${movie.title} cover`;
    image.style.height="300px"
    image.style.width="150px"
    image.style.objectFit="cover"
    informationBox.appendChild(image);
    
    let textbox=document.createElement("div");
    let title= document.createElement("h2");
    let year= document.createElement("p");
    title.innerHTML=movie.title;
    year.innerHTML=movie.year;
    title.style.fontSize="2rem"
    
    textbox.appendChild(title)
    textbox.appendChild(year)
    
    let removeButton= document.createElement("button");
    removeButton.innerHTML=`<i class="fa-solid fa-pen"></i>`
    removeButton.style.border="none"
    removeButton.style.outline="none"
    removeButton.style.background="none"
    removeButton.style.fontSize="2rem"
    removeButton.style.paddingRight="10px"
    removeButton.addEventListener("click", ()=>{
        confirmButton.innerHTML=`<i class="fa-solid fa-trash-can"></i>`
        removeButton.innerHTML=`<i class="fa-solid fa-check"></i>`
        
        confirmButton.addEventListener("click", ()=>{
        deleteData(movie)
        })
        removeButton.addEventListener("click", ()=>{
            removeButton.innerHTML=`<i class="fa-solid fa-pen"></i>`
            confirmButton.innerHTML=`<i class="fa-regular fa-circle"></i>`
            
        })
    })

    informationBox.appendChild(textbox);
    movieInformation.appendChild(informationBox)
    movieInformation.appendChild(removeButton)
    container.appendChild(movieInformation)
    
   

    myWatchList.appendChild(container)
    
  }
  showData()