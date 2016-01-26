var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

function statement(stmt)
{
  'use strict';

  var self = this;

  // Constructor

  var _stmt = stmt;

  // Promise interfaces

  self.bind = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve();
      });

      _stmt.bind.apply(_stmt, args);
    });
  };

  self.reset = function()
  {
    return new Promise(function(resolve)
    {
      _stmt.reset(function()
      {
        resolve();
      });
    });
  };

  self.finalize = function()
  {
    return new Promise(function(resolve)
    {
      _stmt.finalize(function()
      {
        resolve();
      });
    });
  };

  self.run = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve();
      });

      _stmt.run.apply(_stmt, args);
    });
  };

  self.get = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, response)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else if(!response)
          reject({code: 2, description: 'No response retrieved.', url: ''});
        else
          resolve(response);
      });

      _stmt.get.apply(_stmt, args);
    });
  };

  self.all = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, rows)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve(rows);
      });

      _stmt.all.apply(_stmt, args);
    });
  };
}

function database(path)
{
  'use strict';

  if(!(this instanceof database))
    throw {code: 0, description: 'Constructor must be called with new.', url: ''};

  var self = this;

  // Constructor

  var _path = path;
  var _new = !fs.existsSync(_path);
  var _db = new sqlite3.Database(path);

  // Getters

  self.path = function()
  {
    return _path;
  };

  self.new = function()
  {
    return _new;
  };

  // Promise interfaces

  self.run = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve();
      });

      _db.run.apply(_db, args);
    });
  };

  self.get = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, response)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else if(!response)
          reject({code: 2, description: 'No response retrieved.', url: ''});
        else
          resolve(response);
      });

      _db.get.apply(_db, args);
    });
  };

  self.all = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, rows)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve(rows);
      });

      _db.all.apply(_db, args);
    });
  };

  self.exec = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve();
      });

      _db.exec.apply(_db, args);
    });
  };

  self.prepare = function()
  {
    var args = Array.prototype.slice.call(arguments);
    var stmt;

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve(new statement(stmt));
      });

      stmt = _db.prepare.apply(_db, args);
    });
  };

  self.close = function()
  {
    return new Promise(function(resolve, reject)
    {
      _db.close(function(error)
      {
        if(error)
          reject({code: 1, description: 'SQLite error.', url: '', error: error});
        else
          resolve();
      });
    });
  };
}

module.export = {
  database: database
};
