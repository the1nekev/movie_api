const express = require("express"), 
    app = express(),    
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require("uuid");

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

//Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error occurred!');
})


//Array that holds movie obejct with data on those movies.
let movies = [
    {
       "Title": "The Avengers",
       "Description": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
       "Genre": {
            'Name':'Action',
            'Description':'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats'
       },
       "Director": {
            'Name':'Joss Whedon',
            'Bio': 'Joss Whedon is the middle of five brothers - his younger brothers are Jed Whedon and Zack Whedon. Both his father, Tom Whedon and his grandfather, John Whedon were successful television writers. Joss\' mother, Lee Stearns, was a history teacher and she also wrote novels as Lee Whedon. Whedon was raised in New York and was educated at Riverdale Country School, where his mother also taught. He also attended Winchester College in England for two years, before graduating with a film degree from Wesleyan University.',
            'Birth': 1964.0
       },
       "ImageUrl": "https://www.imdb.com/title/tt0848228/mediaviewer/rm3955117056/?ref_=tt_ov_i",
       "Featured" : false
    },
    {
        "Title": "Forrest Gump",
        "Description": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
        "Genre": {
             'Name':'Drama',
             'Description':'Drama is the specific mode of fiction represented in performance: a play, opera, mime, ballet, etc., performed in a theatre, or on radio or television.'
        },
        "Director": {
             'Name':'Robet Zemeckis',
             'Bio': 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies.',
             'Birth': 1952.0
        },
        "ImageUrl": "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i",
        "Featured" : false
     }    
]; 

let users = [
    {
        id: 1,
        name: 'Bella',
        favoriteMovies: ['The Avengers']
    },
    {
        id: 2,
        name: 'Kevin',
        favoriteMovies: [] 
    }
];


//CREATE Request (Allow new users to register)
app.post('/users',  (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }else {
        res.status(400).send('Users need Names');
    }
});

//UPDATE Request (Allow users to update userName)
app.put('/users/:id',  (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }else {
        res.status(400).send('no such user')
    }
});

//CREATE Request 
app.post('/users/:id/:movieTitle',  (req, res) => {
    const { id, movieTitle } = req.params;
    

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
    }else {
        res.status(400).send('no such user')
    }
});

//DELETE (Remove movie from user array)
app.delete('/users/:id/:movieTitle',  (req, res) => {
    const { id, movieTitle } = req.params;
    

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    }else {
        res.status(400).send('no such user')
    }
});

//DELETE (Remove movie from user array)
app.delete('/users/:id',  (req, res) => {
    const { id } = req.params;
    

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);;
    }else {
        res.status(400).send('no such user')
    }
});


//READ Request (Get a list of all Movies)
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

//READ Request (Return data by movie title)
app.get('/movies/:title', (req, res) => {
   const { title } = req.params;
   const movie = movies.find( movie => movie.Title === title);

   if (movie) {
    res.status(200).json(movie);
   }else {
    res.status(400).send('Movie Not Found')
   }
});

//READ Request (Return data for genre by name/title)
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;
 
    if (genre) {
     res.status(200).json(genre);
    }else {
     res.status(400).send('Genre Not Found')
    }
 });

//READ Request (Return data about director )
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;
 
    if (director) {
     res.status(200).json(director);
    }else {
     res.status(400).send('Director Not Found')
    }
 });

//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});