// -------------------------------
// Utility Functions
// -------------------------------
const getLocalUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveLocalUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

// -------------------------------
// Load users from API (first time)
// -------------------------------
const loadUsersFromAPI = async () => {
    if (!localStorage.getItem("users")) {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await res.json();
        saveLocalUsers(users);
    }
    renderUsers();
};

// -------------------------------
// Create User
// -------------------------------
const createUser = async () => {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();

    if (!name || !email) return alert("Enter both name and email!");

    const users = getLocalUsers();

    const newUser = {
        id: Date.now(),
        name,
        email
    };
    users.push(newUser);
    saveLocalUsers(users);
    renderUsers();
};

// -------------------------------
// Update User
// -------------------------------
const updateUser = async (id) => {
    const newName = prompt("Enter new name:");
    const newEmail = prompt("Enter new email:");

    if (!newName || !newEmail) return;

    const users = getLocalUsers();
    const user = users.find(u => u.id === id);

    user.name = newName;
    user.email = newEmail;

    saveLocalUsers(users);
    renderUsers();
};

// -------------------------------
// Delete User
// -------------------------------
const deleteUser = async (id) => {
    let users = getLocalUsers();
    users = users.filter(u => u.id !== id);

    saveLocalUsers(users);
    renderUsers();
};

// -------------------------------
// Render UI
// -------------------------------
const renderUsers = () => {
    const container = document.getElementById("userList");
    const users = getLocalUsers();

    container.innerHTML = ""; // clear

    users.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td style="padding:8px; border-bottom:1px solid #ddd;">${user.name}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd;">${user.email}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd;">
                <button class="editBtn" data-id="${user.id}">Edit</button>
                <button class="deleteBtn" data-id="${user.id}">Delete</button>
            </td>
        `;

        container.appendChild(tr);
    });

    // Attach event listeners for edit/delete buttons
    container.querySelectorAll('.editBtn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = Number(e.target.getAttribute('data-id'));
            await nameexport.updateUser(id);
        });
    });
    container.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = Number(e.target.getAttribute('data-id'));
            await nameexport.deleteUser(id);
        });
    });
};

// -------------------------------
// Events
// -------------------------------
document.getElementById("addBtn").addEventListener("click", async () => {
    await nameexport.createUser();
});

// -------------------------------
// Start App
// -------------------------------
const nameexport = {
    getLocalUsers,
    saveLocalUsers,
    loadUsersFromAPI,
    createUser,
    updateUser,
    deleteUser,
    renderUsers
};

export { nameexport };

nameexport.loadUsersFromAPI();
