const connectionString =
  process.env['CUSTOMCONNSTR_mongoConnection'] ||
  'mongodb+srv://sarpisik:Lolnoob130!@cluster0-d773x.azure.mongodb.net/test?retryWrites=true'

const MongoClient = require('mongodb').MongoClient
const dbName = 'nodejs'
const client = new MongoClient(connectionString, { useNewUrlParser: true })

// CONNECT-DISCONNECT OPERATIONS
function OpenDB() {
  return new Promise(function(resolve, reject) {
    if (!client.isConnected()) {
      return client.connect(function(err) {
        if (err == null) {
          resolve('Connection Success!')
        } else {
          reject(err)
        }
      })
    } else {
      reject('Already Connected!')
    }
  })
}

function CloseDB() {
  return new Promise(function(resolve, reject) {
    if (client.isConnected()) {
      return client.close(function(err) {
        if (err == null) {
          resolve('Disconnect Success!')
        } else {
          reject(err)
        }
      })
    } else {
      reject('Already Disconnected!')
    }
  })
}

// CRUD OPERATIONS
function CreateDB(table, model) {
  return new Promise(function(resolve, reject) {
    if (client.isConnected()) {
      client
        .db(dbName)
        .collection(table)
        .insertOne(model)
        .then(function(res) {
          resolve(res)
        })
        .catch(function(err) {
          reject(err)
        })
    } else {
      reject('Not Connected!')
    }
  })
}

function ReadDB(table, query, fields) {
  return new Promise(function(resolve, reject) {
    if (client.isConnected()) {
      client
        .db(dbName)
        .collection(table)
        .find(query)
        .project(fields)
        .toArray(function(err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
    } else {
      reject('Not Connected!')
    }
  })
}

function UpdateDB(table, query, values) {
  return new Promise(function(resolve, reject) {
    if (client.isConnected()) {
      client
        .db(dbName)
        .collection(table)
        .updateMany(query, values, function(err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
    } else {
      reject('Not Connected!')
    }
  })
}

function DeleteDB(table, query) {
  return new Promise(function(resolve, reject) {
    if (client.isConnected()) {
      client
        .db(dbName)
        .collection(table)
        .deleteMany(query, function(err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
    } else {
      reject('Not Connected!')
    }
  })
}

module.exports = {
  OpenDB,
  CloseDB,
  CreateDB,
  ReadDB,
  UpdateDB,
  DeleteDB
}
