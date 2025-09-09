document.addEventListener('DOMContentLoaded', function() {
    const recipeNameInput = document.getElementById('recipe-name');
    const prepTimeInput = document.getElementById('prep-time');
    const cookTimeInput = document.getElementById('cook-time');
    const servingsInput = document.getElementById('servings');
    const addIngredientBtn = document.getElementById('add-ingredient');
    const addInstructionBtn = document.getElementById('add-instruction');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const instructionsContainer = document.getElementById('instructions-container');
    const themeSelect = document.getElementById('theme-select');
    const printBtn = document.getElementById('print-btn');

    const previewName = document.getElementById('preview-name');
    const previewPrep = document.getElementById('preview-prep');
    const previewCook = document.getElementById('preview-cook');
    const previewServings = document.getElementById('preview-servings');
    const previewIngredients = document.getElementById('preview-ingredients');
    const previewInstructions = document.getElementById('preview-instructions');

    function updatePreview() {
        previewName.textContent = recipeNameInput.value || 'Recipe Name';
        previewPrep.textContent = prepTimeInput.value || '0';
        previewCook.textContent = cookTimeInput.value || '0';
        previewServings.textContent = servingsInput.value || '0';

        updateIngredientsPreview();
        updateInstructionsPreview();
    }

    function updateIngredientsPreview() {
        const ingredientInputs = document.querySelectorAll('.ingredient-input');
        const ingredients = Array.from(ingredientInputs)
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== '');

        if (ingredients.length === 0) {
            previewIngredients.innerHTML = '<li>Add ingredients to see them here</li>';
        } else {
            previewIngredients.innerHTML = ingredients
                .map(ingredient => `<li>${escapeHtml(ingredient)}</li>`)
                .join('');
        }
    }

    function updateInstructionsPreview() {
        const instructionInputs = document.querySelectorAll('.instruction-input');
        const instructions = Array.from(instructionInputs)
            .map(input => input.value.trim())
            .filter(instruction => instruction !== '');

        if (instructions.length === 0) {
            previewInstructions.innerHTML = '<li>Add instructions to see them here</li>';
        } else {
            previewInstructions.innerHTML = instructions
                .map(instruction => `<li>${escapeHtml(instruction)}</li>`)
                .join('');
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function addIngredientField() {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
            <input type="text" class="ingredient-input" placeholder="Enter ingredient">
            <button type="button" class="remove-btn" onclick="removeIngredient(this)">Remove</button>
        `;

        ingredientsContainer.appendChild(ingredientItem);

        const input = ingredientItem.querySelector('.ingredient-input');
        input.addEventListener('input', updatePreview);
        input.focus();
    }

    function addInstructionField() {
        const instructionItem = document.createElement('div');
        instructionItem.className = 'instruction-item';
        instructionItem.innerHTML = `
            <textarea class="instruction-input" placeholder="Enter instruction step" rows="2"></textarea>
            <button type="button" class="remove-btn" onclick="removeInstruction(this)">Remove</button>
        `;

        instructionsContainer.appendChild(instructionItem);

        const textarea = instructionItem.querySelector('.instruction-input');
        textarea.addEventListener('input', updatePreview);
        textarea.focus();
    }

    window.removeIngredient = function(button) {
        const ingredientItems = document.querySelectorAll('.ingredient-item');
        if (ingredientItems.length > 1) {
            button.parentElement.remove();
            updatePreview();
        }
    };

    window.removeInstruction = function(button) {
        const instructionItems = document.querySelectorAll('.instruction-item');
        if (instructionItems.length > 1) {
            button.parentElement.remove();
            updatePreview();
        }
    };

    function switchTheme() {
        const selectedTheme = themeSelect.value;
        document.body.className = selectedTheme;
    }

    function printRecipe() {
        window.print();
    }

    recipeNameInput.addEventListener('input', updatePreview);
    prepTimeInput.addEventListener('input', updatePreview);
    cookTimeInput.addEventListener('input', updatePreview);
    servingsInput.addEventListener('input', updatePreview);
    addIngredientBtn.addEventListener('click', addIngredientField);
    addInstructionBtn.addEventListener('click', addInstructionField);
    themeSelect.addEventListener('change', switchTheme);
    printBtn.addEventListener('click', printRecipe);

    const initialIngredientInput = document.querySelector('.ingredient-input');
    const initialInstructionInput = document.querySelector('.instruction-input');
    if (initialIngredientInput) {
        initialIngredientInput.addEventListener('input', updatePreview);
    }
    if (initialInstructionInput) {
        initialInstructionInput.addEventListener('input', updatePreview);
    }

    switchTheme();
    updatePreview();
});

// Scroll to top function for floating button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Show/hide floating button based on scroll position
window.addEventListener("scroll", function() {
    const floatingBtn = document.querySelector(".floating-btn");
    if (floatingBtn) {
        if (window.scrollY > 200) {
            floatingBtn.style.opacity = "1";
            floatingBtn.style.visibility = "visible";
        } else {
            floatingBtn.style.opacity = "0";
            floatingBtn.style.visibility = "hidden";
        }
    }
});
