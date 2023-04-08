document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const userList = document.getElementById('user-list');
    const userItems = Array.from(userList.getElementsByClassName('user-item'));

    userItems.forEach((userItem) => {
        const userName = userItem.textContent.toLowerCase();
        if (userName.includes(searchTerm)) {
            userItem.style.display = 'block';
        } else {
            userItem.style.display = 'none';
        }
    });
});
