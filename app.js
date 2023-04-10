const axios = require('axios');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
	const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
	const users = usersResponse.data;
	res.render('index', { users });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.get('/profile/:id', async (req, res) => {
	const userId = req.params.id;
	// Fetch the user data
	const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);

	// Fetch the posts for the user
	const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

	// Fetch the albums for the user
	const albumsResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);

	const user = userResponse.data;
	const posts = postsResponse.data;
	const albums = albumsResponse.data;

	// Fetch the photos for each album  
	const albumIds = albums.map(album => album.id);
	const photosPromises = albumIds.map(albumId => axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`));
	const photosResponses = await Promise.all(photosPromises);

	for (let i = 0; i < albums.length; i++) {
		albums[i].photos = photosResponses[i].data;
	}
	res.render('profile', { user, posts, albums });
});

