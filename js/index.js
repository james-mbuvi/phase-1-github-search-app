document.addEventListener('DOMContentLoaded', function () {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchTypeButton = document.getElementById('search-type');
    let searchType = 'user'; // Default search type
  
    // Event listener for the form submission
    githubForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        if (searchType === 'user') {
          searchUsers(searchTerm);
        } else if (searchType === 'repo') {
          searchRepos(searchTerm);
        }
      }
    });
  
    // Event listener for search type toggle button
    searchTypeButton.addEventListener('click', function () {
      searchType = searchType === 'user' ? 'repo' : 'user';
      searchTypeButton.textContent = `Search ${searchType === 'user' ? 'Repos' : 'Users'}`;
    });
  
    // Function to search for users
    function searchUsers(searchTerm) {
      fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error('Error:', error));
    }
  
    // Function to display user search results
    function displayUsers(users) {
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" />
          <p>${user.login}</p>
          <a href="${user.html_url}" target="_blank">View Profile</a>
        `;
        listItem.addEventListener('click', () => getUserRepos(user.login));
        userList.appendChild(listItem);
      });
    }
  
    // Function to search for repositories
    function searchRepos(searchTerm) {
      fetch(`https://api.github.com/search/repositories?q=${searchTerm}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => displayRepos(data.items))
        .catch(error => console.error('Error:', error));
    }
  
    // Function to display repository search results
    function displayRepos(repos) {
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <p>${repo.full_name}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        reposList.appendChild(listItem);
      });
    }
  
    // Function to get repositories for a specific user
    function getUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error('Error:', error));
    }
  });
  