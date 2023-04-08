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
    const userPromise = axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const postsPromise = axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const albumsPromise = axios.get(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
  
    const [userResponse, postsResponse, albumsResponse] = await Promise.all([userPromise, postsPromise, albumsPromise]);
  
    const user = userResponse.data;
    const posts = postsResponse.data;
    const albums = albumsResponse.data;

    const postIds = posts.map(post => post.id);
    const commentsPromises = postIds.map(postId => axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`));
    const commentsResponses = await Promise.all(commentsPromises);
  
    for (let i = 0; i < posts.length; i++) {
      posts[i].comments = commentsResponses[i].data;
    }
  
    res.render('profile', { user, posts, albums });
  });

  