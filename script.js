class Person {
  constructor(name, address, email, phoneNumber, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.birthdate = birthdate;
  }

  calculateAge() {
    const birthdate = new Date(this.birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }
}

class User extends Person {
  constructor(name, address, email, phoneNumber, birthdate, job, company) {
    super(name, address, email, phoneNumber, birthdate);
    this.job = job;
    this.company = company;
  }

  isRetired() {
    return this.calculateAge() < 65;
  }
}

async function fetchUserData() {
  try {
    const response = await fetch("https://api.npoint.io/9cda598e0693b49ef1eb");
    const data = await response.json();
    const users = data.map(
      (user) =>
        new User(
          user.name,
          user.address,
          user.email,
          user.phone_number,
          user.birthdate,
          user.job,
          user.company
        )
    );
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}



const usersPerPage = 10;
let currentPage = 1;
let users = [];

function displayUsers(users, page) {
  const start = (page - 1) * usersPerPage;
  const end = page * usersPerPage;
  const usersToDisplay = users.slice(start, end);

  const tableBody = document.getElementById("user-table-body");
  tableBody.innerHTML = "";

  usersToDisplay.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.address}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.job}</td>
            <td>${user.company}</td>
            <td>${user.calculateAge()}</td>
            <td>${user.isRetired() ? "Yes" : "No"}</td>
        `;
    tableBody.appendChild(row);
  });

  document.getElementById(
    "pagination-info"
  ).innerText = `Page ${page} of ${Math.ceil(users.length / usersPerPage)}`;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    currentPage = 1;
    displayUsers(filteredUsers, currentPage);
  });
}

function setupPagination() {
  const previousButton = document.getElementById("previous-button");
  const nextButton = document.getElementById("next-button");

  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayUsers(users, currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      currentPage++;
      displayUsers(users, currentPage);
    }
  });
}

async function init() {
  users = await fetchUserData();
  displayUsers(users, currentPage);
  setupSearch();
  setupPagination();
}
init();
