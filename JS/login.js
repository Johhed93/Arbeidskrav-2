//Fetch api
const USERBASE_URL = "https://crudapi.co.uk/api/v1/user";
const API_KEY = "XgZAbMaJMOh5JZMo8gqNs8I__snYynl3o_H7dtDrhIfBClHGcQ";
const getHeaders = (apiKey) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
};

//Login functions and sessionstorage setup
const setLoginstatus = (status) => {
  sessionStorage.setItem("loggedIn", status ? "true" : "false");
};
const loggedIn = () => {
  return sessionStorage.getItem("loggedIn") === "true";
};

const getLoggedInUser = () => {
  return JSON.parse(sessionStorage.getItem("loggedInUser"));
};
const setLoggedInUser = (id) => {
  return sessionStorage.setItem("loggedInUser", JSON.stringify(id));
};

//Verification username and login

const ifUsernameExist = async (username) => {
  try {
    const res = await fetch(USERBASE_URL);
    if (!res.ok) {
      throw new Error("Något er feil i databasen ved verifiering av bruker");
    }
    const data = await res.json();
    return data.some((user) => user.username === username);
  } catch (error) {
    console.error("Något blev fel i verifiering av brukernavn");
  }
};
const verifyLogin = async (username, password) => {
  try {
    const res= await fetch(USERBASE_URL,{
        method: "GET",
        headers: getHeaders(API_KEY)
      });
    if (!res.ok) {
      throw new Error("Något blev fel i fetch til verifiering av login");
    }
    const data = await res.json();
    console.log(data.items)
  
   
    return data.items.some((user) =>  user.username === username && user.password === password);
  } catch (error) {
    console.error("Kunde inte verifiera login", error);
  }
};

const userLogin = async () => {
  const usernameInput = document.querySelector("#usernameInput").value;
  const passwordInput = document.querySelector("#passwordInput").value;
  try {
    if (!await verifyLogin(usernameInput, passwordInput)) {
      console.log("Feil brukernavn/passord");
      
    } else {
      
      setLoginstatus(true);
      const userID = await fetchUserID(usernameInput); 
      sessionStorage.setItem("loggedInUser", JSON.stringify(userID));
      

    }
  } catch (error) {
    console.error("Något blev feil i verifiering av login", error.message);
  }
};
const fetchUserID= async(username)=>{
  try{
  const res= await fetch(USERBASE_URL,{
    method:"GET",
    headers:getHeaders(API_KEY)
  })
  const data=await res.json();
  const findUser= data.items.find(user=> user.username===username);
  return findUser._uuid;
  }catch(error){
    console.error("Något blev fel med att henta id", error.message)
  }
}
const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", async () => {
  await userLogin();
});
