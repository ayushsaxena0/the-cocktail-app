document.querySelector("#search").addEventListener("click", findDrink);

async function findDrink() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  const drinkName = document.querySelector("input").value.trim();
  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`
    );
    const data = await res.json();

    // add drinks to list
    addDrinksToList(data.drinks, tbody);

    // add event listeners on all drinks
    const descBtn = document.querySelectorAll(".drink");

    Array.from(descBtn).forEach((el) => {
      el.addEventListener("click", getDrinkDesc);
    });
  } catch (error) {
    console.error(error);
  }
}

function addDrinksToList(drinks, tbody) {
  drinks.forEach((drink, index) => {
    let row = document.createElement("tr");
    row.classList.add("table-primary");
    row.dataset.id = drink.idDrink;
    row.innerHTML = `
        <td scope="row">${index + 1}</td>
        <td><img src=${drink.strDrinkThumb} class="drink-img-list"></td>
        <td class="drink">${drink.strDrink}</td>
      `;

    tbody.appendChild(row);
  });
}

async function getDrinkDesc() {
  const drinkImage = document.querySelector(".card-img");
  const drinkName = document.querySelector(".card-title");
  const drinkInstruction = document.querySelector(".instructions");
  const drinkIngredient = document.querySelector(".ingredients");
  if (drinkIngredient.innerHTML !== "") {
    drinkIngredient.innerHTML = "";
  }
  const drinkId = this.parentNode.dataset.id;

  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`
    );
    const data = await res.json();
    console.log(data);

    // display card
    const card = document.querySelector(".card");
    const appName = document.querySelector(".app-name");
    card.classList.remove("hidden");
    appName.classList.add("hidden");

    // plugging the info
    drinkImage.src = data.drinks[0].strDrinkThumb;
    drinkName.innerText = data.drinks[0].strDrink;
    drinkInstruction.innerText = data.drinks[0].strInstructions;

    // LOOP THROUGH THE INGREDIENTS
    // object into array
    const drinkArr = Object.entries(data.drinks[0]);

    // get the ingredients
    const ingredients = drinkArr
      .filter(
        (drink) => drink[0].startsWith("strIngredient") && drink[1] !== null
      )
      .map((drink) => drink[1]);

    // plugging them in the html
    ingredients.forEach((el, index) => {
      let span = document.createElement("span");
      if (index === ingredients.length - 1) {
        span.innerText = `${el}`;
      } else {
        span.innerText = `${el} | `;
      }

      span.style.fontWeight = 600;
      drinkIngredient.appendChild(span);
    });
  } catch (error) {
    console.error(error);
  }
}
