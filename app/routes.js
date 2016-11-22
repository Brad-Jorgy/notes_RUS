var Note = require('./models/note');

function getNotes(res) {
    Note.find(function (err, notes) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(notes); // return all notes in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all notes
    app.get('/api/notes', function (req, res) {
        // use mongoose to get all notes in the database
        getNotes(res);
    });

    // create note and send back all notes after creation
    app.post('/api/notes', function (req, res) {

        // create a note, information comes from AJAX request from Angular
        Note.create({
            body: req.body.body,
            key: req.body.key,
            title: req.body.title,
            done: false
        }, function (err, note) {
            if (err)
                res.send(err);

            // get and return all the notes after you create another
            getNotes(res);
        });

    });

    // delete a note
    app.delete('/api/notes/:note_id', function (req, res) {
        Note.remove({
            _id: req.params.note_id
        }, function (err, note) {
            if (err)
                res.send(err);

            getNotes(res);
        });
    });

    //update a note
    app.post('/api/notes/:note_id', function (req, res) {
        console.log('updating ' + req.params.note_id);
        Note.findById(req.params.note_id, function(err,doc){
            if(err){
                res.send(err);
            } else {
                doc.title = req.body.title;
                doc.body = req.body.body;
                doc.save(getNotes(res));
            }
        });

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
