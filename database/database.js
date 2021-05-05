"use strict"
/**
 * Defining mongodb connection variable
 * @type {MongoClient}
 */
const MongoClient = require('mongodb').MongoClient;

/**
 * Adding new const to add  mongoConnect callback
 * @param callback
 */
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://localhost:27017/myshop')
    .then((client) => {
      callback(client);
      _db = client.db();
    }).catch((err) => {
      console.log(err)
     throw err}
    );
};
/**
 * Creating a const to call the database for this young one <3
 */
const getdb = () => {
  if(_db){
    return _db;
  }
  throw "No database connected";
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
