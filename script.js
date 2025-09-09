document.addEventListener('DOMContentLoaded', function() {
    // Get all form elements
    const recipeNameInput = document.getElementById('recipe-name');
    const prepTimeInput = document.getElementById('prep-time');
    const cookTimeInput = document.getElementById('cook-time');
    const servingsInput = document.getElementById('servings');
    const addIngredientBtn = document.getElementById('add-ingredient');
    const addInstructionBtn = document.getElementById('add-instruction');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const instructionsContainer = document.getElementById('instructions-container');
    const printBtn = document.getElementById('print-btn');
    
    // Image elements
    const imageInput = document.getElementById('recipe-image');
    const imageUploadArea = document.getElementById('image-upload-area');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');
    const recipeImageContainer = document.getElementById('recipe-image-container');
    const recipeCardImage = document.getElementById('recipe-card-image');

    // Get preview elements
    const previewName = document.getElementById('preview-name');
    const previewPrep = document.getElementById('preview-prep');
    const previewCook = document.getElementById('preview-cook');
    const previewServings = document.getElementById('preview-servings');
    const previewIngredients = document.getElementById('preview-ingredients');
    const previewInstructions = document.getElementById('preview-instructions');

    // Get theme elements
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // Theme switching functionality
    function switchTheme(themeName) {
        // Remove existing theme classes
        body.classList.remove('theme-classic', 'theme-modern', 'theme-minimal');
        // Add new theme class
        body.classList.add(`theme-${themeName}`);
        
        // Update active button
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
            }
        });

        // Add fade-in animation to content
        const mainContent = document.querySelector('.main-content');
        mainContent.classList.remove('fade-in');
        setTimeout(() => {
            mainContent.classList.add('fade-in');
        }, 50);

        // Store theme preference
        localStorage.setItem('recipeCardTheme', themeName);
    }

    // Initialize theme from localStorage or default to classic
    function initializeTheme() {
        const savedTheme = localStorage.getItem('recipeCardTheme') || 'classic';
        switchTheme(savedTheme);
    }

    // Add event listeners to theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const theme = e.target.dataset.theme;
            switchTheme(theme);
        });
    });

    // Update preview function
    function updatePreview() {
        // Update recipe name
        const recipeName = recipeNameInput.value.trim();
        previewName.textContent = recipeName || 'Your Recipe Name';

        // Update times and servings
        const prepTime = prepTimeInput.value || '0';
        const cookTime = cookTimeInput.value || '0';
        const servings = servingsInput.value || '0';
        
        previewPrep.textContent = `${prepTime} min`;
        previewCook.textContent = `${cookTime} min`;
        previewServings.textContent = servings;

        // Update ingredients
        updateIngredientsPreview();
        
        // Update instructions
        updateInstructionsPreview();

        // Add slide-in animation to updated content
        const recipeCard = document.getElementById('recipe-card');
        recipeCard.classList.remove('slide-in');
        setTimeout(() => {
            recipeCard.classList.add('slide-in');
        }, 10);
    }

    // Update ingredients preview
    function updateIngredientsPreview() {
        const ingredientInputs = document.querySelectorAll('.ingredient-input');
        const ingredients = Array.from(ingredientInputs)
            .map(input => input.value.trim())
            .filter(ingredient => ingredient !== '');

        if (ingredients.length === 0) {
            previewIngredients.innerHTML = '<li class="placeholder-text">Add ingredients to see them here</li>';
        } else {
            previewIngredients.innerHTML = ingredients
                .map(ingredient => `<li>${escapeHtml(ingredient)}</li>`)
                .join('');
        }
    }

    // Update instructions preview
    function updateInstructionsPreview() {
        const instructionInputs = document.querySelectorAll('.instruction-input');
        const instructions = Array.from(instructionInputs)
            .map(input => input.value.trim())
            .filter(instruction => instruction !== '');

        if (instructions.length === 0) {
            previewInstructions.innerHTML = '<li class="placeholder-text">Add instructions to see them here</li>';
        } else {
            previewInstructions.innerHTML = instructions
                .map(instruction => `<li>${escapeHtml(instruction)}</li>`)
                .join('');
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add new ingredient field
    function addIngredientField() {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item bounce-in';
        ingredientItem.innerHTML = `
            <input 
                type="text" 
                class="form-input ingredient-input" 
                placeholder="e.g., 2 cups all-purpose flour"
            >
            <button type="button" class="remove-btn" onclick="removeIngredient(this)">
                <span class="remove-icon">🗑️</span>
            </button>
        `;

        ingredientsContainer.appendChild(ingredientItem);

        // Focus the new input
        const newInput = ingredientItem.querySelector('.ingredient-input');
        newInput.addEventListener('input', updatePreview);
        newInput.focus();
    }

    // Add new instruction field
    function addInstructionField() {
        const instructionItem = document.createElement('div');
        instructionItem.className = 'instruction-item bounce-in';
        instructionItem.innerHTML = `
            <textarea 
                class="form-textarea instruction-input" 
                placeholder="e.g., Preheat oven to 350°F and grease a baking pan..."
                rows="3"
            ></textarea>
            <button type="button" class="remove-btn" onclick="removeInstruction(this)">
                <span class="remove-icon">🗑️</span>
            </button>
        `;

        instructionsContainer.appendChild(instructionItem);

        // Focus the new textarea
        const newTextarea = instructionItem.querySelector('.instruction-input');
        newTextarea.addEventListener('input', updatePreview);
        newTextarea.focus();
    }

    // Remove ingredient (global function for onclick)
    window.removeIngredient = function(button) {
        const ingredientItems = document.querySelectorAll('.ingredient-item');
        if (ingredientItems.length > 1) {
            const item = button.closest('.ingredient-item');
            item.classList.add('slide-out-left');
            setTimeout(() => {
                item.remove();
                updatePreview();
            }, 300);
        }
    };

    // Remove instruction (global function for onclick)
    window.removeInstruction = function(button) {
        const instructionItems = document.querySelectorAll('.instruction-item');
        if (instructionItems.length > 1) {
            const item = button.closest('.instruction-item');
            item.classList.add('slide-out-left');
            setTimeout(() => {
                item.remove();
                updatePreview();
            }, 300);
        }
    };

    // Image handling functions
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                // Show preview in form
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
                imageUploadArea.style.display = 'none';
                
                // Show image in recipe card
                recipeCardImage.src = e.target.result;
                recipeImageContainer.style.display = 'block';
                recipeImageContainer.classList.add('bounce-in');
                
                // Animate the changes
                setTimeout(() => {
                    updatePreview();
                }, 100);
            };
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        imageInput.value = '';
        imagePreview.style.display = 'none';
        imageUploadArea.style.display = 'block';
        
        // Hide image in recipe card with animation
        recipeImageContainer.classList.add('slide-out-left');
        setTimeout(() => {
            recipeImageContainer.style.display = 'none';
            recipeImageContainer.classList.remove('slide-out-left');
        }, 300);
    }

    // Print functionality
    function printRecipe() {
        // Add a small delay to ensure all styles are applied
        setTimeout(() => {
            window.print();
        }, 100);
    }

    // Enhanced form validation
    function validateForm() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            if (input.value.trim() && !input.classList.contains('ingredient-input') && !input.classList.contains('instruction-input')) {
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
    }

    // Add event listeners for main form inputs
    recipeNameInput.addEventListener('input', updatePreview);
    prepTimeInput.addEventListener('input', updatePreview);
    cookTimeInput.addEventListener('input', updatePreview);
    servingsInput.addEventListener('input', updatePreview);
    addIngredientBtn.addEventListener('click', addIngredientField);
    addInstructionBtn.addEventListener('click', addInstructionField);
    printBtn.addEventListener('click', printRecipe);

    // Add image event listeners
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', removeImage);
    }

    // Add validation on input change
    const allInputs = document.querySelectorAll('.form-input, .form-textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });

    // Initialize event listeners for existing ingredient and instruction inputs
    const initialIngredientInput = document.querySelector('.ingredient-input');
    const initialInstructionInput = document.querySelector('.instruction-input');
    
    if (initialIngredientInput) {
        initialIngredientInput.addEventListener('input', updatePreview);
    }
    if (initialInstructionInput) {
        initialInstructionInput.addEventListener('input', updatePreview);
    }

    // Add visual feedback for form interactions
    function addFormInteractionFeedback() {
        const allFormInputs = document.querySelectorAll('.form-input, .form-textarea');
        
        allFormInputs.forEach(input => {
            input.addEventListener('focus', function() {
                const parent = this.closest('.form-group, .ingredient-item, .instruction-item');
                if (parent) {
                    parent.classList.add('focused');
                }
            });
            
            input.addEventListener('blur', function() {
                const parent = this.closest('.form-group, .ingredient-item, .instruction-item');
                if (parent) {
                    parent.classList.remove('focused');
                }
            });
        });
    }

    // Smooth scrolling for better UX
    function smoothScrollToPreview() {
        const previewSection = document.querySelector('.recipe-preview-section');
        if (previewSection) {
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Add scroll to preview when form is updated on mobile
    if (window.innerWidth <= 768) {
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(smoothScrollToPreview, 500);
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printRecipe();
        }
        
        // Ctrl/Cmd + I for new ingredient
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            addIngredientField();
        }
        
        // Ctrl/Cmd + Shift + I for new instruction
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            addInstructionField();
        }
    });

    // Initialize the app
    initializeTheme();
    updatePreview();
    validateForm();
    addFormInteractionFeedback();

    // Add entrance animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.form-card, .preview-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);
});