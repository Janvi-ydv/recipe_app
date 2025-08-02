const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseButton = document.querySelector('.recipe-close-button');

// Function to get recipes
const fetchRecipes = async (query) => {
    if (!query) {
        recipeContainer.innerHTML = "Please enter a search term.";
        return;
    }

    recipeContainer.innerHTML = "Fetching Recipes...";
    
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = ""; // Clear previous results
        
        if (response.meals && response.meals.length > 0) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="recipe-content">
                        <h3>${meal.strMeal}</h3>
                        <div class="recipe-tags">
                            <span class="recipe-tag">${meal.strArea}</span>
                            <span class="recipe-tag">${meal.strCategory}</span>
                        </div>
                        <p>Delicious ${meal.strMeal} from ${meal.strArea} cuisine. Perfect for any occasion!</p>
                        <div class="recipe-meta">
                            <div class="recipe-time">
                                <i class="fa-solid fa-clock"></i>
                                <span>30 mins</span>
                            </div>
                            <div class="recipe-difficulty">
                                <i class="fa-solid fa-star"></i>
                                <span>Medium</span>
                            </div>
                        </div>
                    </div>
                `;

                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.querySelector('.recipe-content').appendChild(button);
                 
                // Adding EventListener to recipe button
                button.addEventListener('click', ()=>{
                    openRecipePopup(meal);

                });


                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "No recipes found. Try a different search term.";
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = "Error fetching recipes. Please try again.";
    }
}
// Function to fetch ingredients and measurements
const fetchIngredients=(meal) =>{
    let ingredientsList="";
    for(let i=1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`

        }
        else{
            break;
        }
    }
    return ingredientsList;

}
const openRecipePopup =(meal) => {
    recipeDetailsContent.innerHTML =`
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients</h3>
    <ul class="IngredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    `
    
    recipeDetailsContent.parentElement.style.display="block";

}

recipeCloseButton.addEventListener('click',()=>{
    recipeDetailsContent.parentElement.style.display ="none";

});
searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
    // console.log("Button clicked");
});

