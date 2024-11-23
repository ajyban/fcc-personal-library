/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { default: mongoose } = require("mongoose");

module.exports = function (app) {

  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String]
  });
  const BookModel = mongoose.model('BookModel', bookSchema);

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find()
        .then((books) => {
          const mappedBooks = books
            .map(({ _id, title, comments }) => ({
              _id,
              title,
              commentcount: comments?.length || 0
            }));
          return res.json(mappedBooks);
        })
        .catch(console.error)
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.json('missing required field title');
      }
      //response will contain new book object including atleast _id and title
      const book = new BookModel({
        title,
        comments: []
      });
      book.save()
        .then((savedBook) => {
          return res.json({ title: savedBook.title, _id: savedBook._id })
        })
        .catch(console.error)
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({})
        .then(() => res.json('complete delete successful'))
        .catch(console.error)
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid)
        .then((book) => {
          if (book) {
            return res.json({ _id: book._id, title: book.title, comments: book.comments || [] });
          } else {
            return res.json('no book exists')
          }

        })
        .catch(console.error)
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.json('missing required field comment')
      }
      //json res format same as .get
      BookModel.findById(bookid)
        .then((book) => {
          if (book) {
            book.comments.push(comment);
            book.markModified('comments');
            book.save()
              .then((book) => {
                return res.json({ _id: book._id, title: book.title, comments: book.comments });
              })
              .catch(console.error);
          } else {
            return res.json('no book exists');
          }
        })
        .catch(console.error);
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.findByIdAndDelete(bookid)
        .then((book) => book ? res.json('delete successful') : res.json('no book exists'))
        .catch(console.error)
    });

};
