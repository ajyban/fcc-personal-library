/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let validBook= {};
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'book 1'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'book 1');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {
     
      test('Test GET /api/books', function (done) {
        chai.request(server)
        .get('/api/books')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.isDefined(res.body[0].title);
          validBook = res.body[0];
          done();
        });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
        .get('/api/books/6741e5a951c1c20f5c740811')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
        .get(`/api/books/${validBook._id}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, validBook.title);
          done();
        });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
        .post(`/api/books/${validBook._id}`)
        .send({comment: 'abcd'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, validBook.title);
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
        .post(`/api/books/${validBook._id}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
        .post(`/api/books/6741e5a951c1c20f5c740811`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field comment');
          done();
        });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
        .delete(`/api/books/${validBook._id}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
        .delete(`/api/books/6741e5a951c1c20f5c740811`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

    });

  });

});
