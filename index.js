const express = require("express"), // import express and morgan
    morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

//Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error occurred!');
})


//Array that holds movie obejct with data on those movies.
let topMovies = [
    {
        title: 'Marvel\'s Avengers',
    },
    {
        title: 'Captain America',
    },
    {
        title: 'Black Panther',
    }, 
    {
        title: 'Forrest Gump'
    }, 
    {
        title: 'Finding Nemo'
    }, 
    {
        title: 'Pokemon 2000'
    }
]; 

//GET Requests
app.get('/', (req, res) => {
    res.send('My Top Ten (10) Movies of all Time!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root:__dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});


//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});