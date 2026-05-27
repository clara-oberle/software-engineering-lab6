# software-engineering-lab6
Repository used for Lab 6: Prompts Engineering with GitHub and VC following a set of functional requirements

Team Members:
Clara Oberle Melero
Álvaro García López
Bet Jara
Mikel Carbones
Agustina Ciponi
Alex Jarne
Nicolas Kramer

## First Prompt and Initial Generation

Prompt use for US-01:

Create a Recipe Management web application using HTML, CSS, and vanilla JavaScript.
Requirements:
- Add recipes with:
  - recipe name
  - ingredients
  - preparation steps
- Display recipes in cards
- Include buttons to edit and delete recipes
- Add a search bar to search by recipe name or ingredient
- Save recipes using localStorage
- Show confirmation messages after actions
- Modern responsive design
- Separate HTML, CSS, and JavaScript files 


For the first iteration of the project, we used GitHub Copilot to generate the initial structure and functionality of the Recipe Management application. We provided a general prompt describing the required features, including recipe creation, editing, deletion, search functionality, localStorage persistence, confirmation messages, and responsive design.

Copilot analyzed the prompt and generated the base implementation across three separate files: `index.html`, `style.css`, and `script.js`. The generated code included the main interface structure, recipe cards, CRUD functionality, search bar, and data persistence using localStorage.

This first generation gave us a functional starting point that we later refined with more specific prompts and iterative improvements.
<img width="1423" height="761" alt="image" src="https://github.com/user-attachments/assets/4e0ddce9-85bf-4235-9ffd-3179f631cca4" />
<img width="1892" height="859" alt="image" src="https://github.com/user-attachments/assets/34a67007-55ba-4fca-89a0-10429cd25815" />


## Second Prompt for US-02

Improve the user interface of the Recipe Management app.

Requirements:
- Modern responsive layout
- Better spacing and typography
- Styled recipe cards with hover effects
- Styled buttons for add, edit, delete, and undo
- Responsive design for mobile devices
- Add toast notification styling
- Improve the recipe form layout
- Use a clean color palette

In the image we can see that now we can search for recipes using the search bar at the top right of the screen.
<img width="2476" height="1270" alt="image" src="https://github.com/user-attachments/assets/a73b975a-06c3-4aab-a9cd-5e91b9a81c69" />


## Third Prompt for US-03

Improve the Recipe Management app to fully satisfy the acceptance criteria.

Requirements:
- Add an undo option after deleting a recipe.
- When a recipe is deleted, show a toast message with an Undo button.
- If the user clicks Undo, restore the deleted recipe.
- Add a Cancel button when editing a recipe, so the user can cancel the edit.
- Show confirmation messages after adding, editing, deleting, and undoing.
- Make sure all changes are saved correctly in localStorage.
- Make sure recipes remain available after refreshing the page.
- Add an empty state when there are no recipes or no search results.
- Keep the code in HTML, CSS, and vanilla JavaScript. 

We can see in the following image that now we can edit the recipe, we changed the ingridients of recipe of the chip cookies. 
<img width="1210" height="625" alt="Captura de pantalla 2026-05-27 a las 15 49 38" src="https://github.com/user-attachments/assets/5399e72e-cdae-4596-943a-042d85769187" />

## Fourth Prompt for US-04

Prompt used for US-04:

Final refinement for the Recipe Management app, focusing especially on US-04: “As a user, I want to delete recipes to keep the system organized.”

Review only the current HTML, CSS, and JavaScript files. Do not modify README.md.

Make sure the delete recipe functionality fully satisfies these acceptance criteria:

US-04 Acceptance Criteria:
- The delete functionality must be available in the main interface.
- The user must be able to undo the delete action if necessary.
- The system must confirm the delete action with a message afterward.
- All recipe data must be saved correctly and remain accessible afterward.

Required improvements:
1. Make sure every recipe card has a clearly visible Delete button.
2. When the user clicks Delete, remove the recipe from the list.
3. Show a confirmation toast/message saying the recipe was deleted.
4. The delete confirmation must include an Undo button.
5. If the user clicks Undo, restore the deleted recipe exactly as it was before.
6. Update localStorage after delete and after undo.
7. If the user deletes a recipe and refreshes without clicking Undo, the recipe must remain deleted.
8. If the user clicks Undo and then refreshes, the restored recipe must remain available.
9. Use clear accessible labels for Delete and Undo buttons.
10. Keep the implementation simple and in vanilla JavaScript.
11. Do not add new unrelated features.
12. Do not change README.md.

We can see that we can successfully delete the recipe and we get a message confirming it.
<img width="2278" height="1182" alt="image" src="https://github.com/user-attachments/assets/96091b2b-d45a-4d78-888f-e4a8ae6216aa" />

