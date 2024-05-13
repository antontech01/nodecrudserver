const { createServer } = require('http')

let db = [
    {
      id: 1,
      title: "Killin' Them Softly",
      comedian: "Dave Chappelle",
      year: 2000
    },
    {
      id: 2,
      title: "Bigger & Blacker",
      comedian: "Chris Rock",
      year: 1999
    },
    {
      id: 3,
      title: "Live on the Sunset Strip",
      comedian: "Richard Pryor",
      year: 1982
    },
    {
      id: 4,
      title: "Hilarious",
      comedian: "Louis C.K.",
      year: 2010
    },
    {
      id: 5,
      title: "Delirious",
      comedian: "Eddie Murphy",
      year: 1983
    },
    {
      id: 6,
      title: "Bring the Pain",
      comedian: "Chris Rock",
      year: 1996
    },
    {
      id: 7,
      title: "Laugh at My Pain",
      comedian: "Kevin Hart",
      year: 2011
    },
    {
      id: 8,
      title: "Chewed Up",
      comedian: "Louis C.K.",
      year: 2008
    },
    {
      id: 9,
      title: "The Age of Spin: Dave Chappelle Live at the Hollywood Palladium",
      comedian: "Dave Chappelle",
      year: 2017
    },
    {
      id: 10,
      title: "Dress to Kill",
      comedian: "Eddie Izzard",
      year: 1998
    },
    {
      id: 11,
      title: "Bare",
      comedian: "Jim Jefferies",
      year: 2014
    },
    {
      id: 12,
      title: "Happiness",
      comedian: "Daniel Tosh",
      year: 2016
    },
    {
      id: 13,
      title: "Mr. Universe",
      comedian: "Jim Gaffigan",
      year: 2012
    },
    {
      id: 14,
      title: "My Girlfriend's Boyfriend",
      comedian: "Mike Birbiglia",
      year: 2013
    },
    {
      id: 15,
      title: "Lock n' Load",
      comedian: "Eddie Griffin",
      year: 2010
    }
  ];
  


const handleRequest = (req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    const [, jokeId] = req.url.split('/').filter(Boolean);
    const id = parseInt(jokeId);

    if(req.url === '/' && req.method === 'GET') {
        getJoke(req, res)
    } else if(req.url === '/' && req.method === 'POST') {
        addJoke(req, res)
    } else if(req.url.startsWith('/joke/') && req.method === 'PATCH') {
        updateJoke(req, res, id)
    } else if(req.url.startsWith('/joke/') && req.method === 'DELETE') {
        deleteJoke(req, res, id)
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }



}

function findJokeById(id) {
    return db.find(joke => joke.id === id);
}

function addJoke(req,res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        const { title, comedian, year } = JSON.parse(body);
        const newJoke = { id: db.length + 1, title, comedian, year };
        db.push(newJoke);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db));
    });
}


function getJoke(req,res) {

    res.writeHead(200)
    res.end(JSON.stringify({data: db, message: 'Jokes received successfully' }));
}

function updateJoke(req, res, id) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        const { title, comedian, year } = JSON.parse(body);
        const jokeToUpdate = findJokeById(id);
        if (jokeToUpdate) {
            jokeToUpdate.title = title || jokeToUpdate.title;
            jokeToUpdate.comedian = comedian || jokeToUpdate.comedian;
            jokeToUpdate.year = year || jokeToUpdate.year;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jokeToUpdate));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Joke not found');
        }
    });

}

function deleteJoke(req, res, id ) {

        const jokeToDelete = findJokeById(id);
        if (jokeToDelete) {
            db = db.filter(joke => joke.id !== id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jokeToDelete));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Joke not found');
        }
    
}


const server = createServer(handleRequest)

server.listen(3000, '127.0.0.1', () => {
 console.log('Server running')
})