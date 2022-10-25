const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config(path = '.env')
const Note = require('./models/note')



const requestLogger = (request, response, next) => {
  console.log("logging request...")
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(express.static('build'));

app.use(requestLogger)

app.use(cors())




// route handlers
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})


app.post('/api/notes', (request, response, next) => {
  const body = request.body
  
  if (body.content == undefined) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
  .then(savedNote => response.json(savedNote))
  .catch(error => next(error));

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId(),
  // }

  // notes = notes.concat(note)

  // response.json(note)
})


// get all notes
app.get('/api/notes', (req, res) => {
  console.log("entered")
  Note.find({}).then(notes => {
    console.log(notes);
    res.json(notes)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // notes = notes.filter(note => note.id !== id)

  // response.status(204).end()
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
   response.status(204).end()
  }) 
  .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const note = notes.find(note => note.id === id)

 

  Note.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    next(error)
  })
})

// route for updating an individual note

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    console.log("entered....")
    console.log({body})
    
    const note = {
      content: body.content,
      important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note, {new:true})
    .then(updatedNote => response.json(updatedNote))
    .catch(err => next(err))
})

//unknown endpoint middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//error handler middleware

const errorHandler = (error, request, response, next) => {
  console.log({error})

  if(error.name === 'CastError') {
    return response.status(400).send({error: "malformatted id"})
  } else if(error.name === 'ValidationError' ) { 
    return response.status(400).send({error: error.message})
   
  }
  
  next(error)

}

app.use(errorHandler)

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})