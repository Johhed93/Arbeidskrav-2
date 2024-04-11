//Fetch api
const USERBASE_URL = "https://crudapi.co.uk/api/v1/user";
const API_KEY = "XgZAbMaJMOh5JZMo8gqNs8I__snYynl3o_H7dtDrhIfBClHGcQ";
const getHeaders = (apiKey) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
};

const ifUsernameExist = async (username) => {
  try {
    const res = await fetch(USERBASE_URL,{
        method:"GET",
        headers:getHeaders(API_KEY)
    });
    if (!res.ok) {
      throw new Error("Något er feil i databasen ved verifiering av bruker");
    }
    const data = await res.json();
    return data.items.some((user) => user.username === username);
  } catch (error) {
    console.error("Något blev fel i verifiering av brukernavn");
  }
};

const newUser = async () => {
  const newUsernameInput = document.querySelector("#newUsernameInput").value;
  const newPasswordInput = document.querySelector("#newPasswordInput").value;

  try {
    const user = [
      { username: newUsernameInput, password: newPasswordInput, myMovies: [] },
    ];

    if (await ifUsernameExist(newUsernameInput)) {
      alert("Brukernavnet eksisterer allerede");
    } else {
      //post user
      const res = await fetch(USERBASE_URL, {
        method: "POST",
        headers: getHeaders(API_KEY),
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        throw new error("Du gjorde feil et sted");
      }
    }
  } catch (error) {
    console.error("Det ble noe feil med registrering av bruker");
  }
};

const submitNewUsernameBtn = document.querySelector("#submitNewUsernameBtn");
submitNewUsernameBtn.addEventListener("click", async () => {
  await newUser();
});
