'use strict'

var sqlite3 = require("sqlite3").verbose();

function sqlitep(path)
{
  // Constructor

  var _db = new sqlite3.Database(path);

  // Promise interface

  var __run__ = this.run = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error)
      {
        if(error)
          reject(error);
        else
          resolve();
      });

      _db.run.apply(_db, args);
    });
  };

  var __get__ = this.get = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, response)
      {
        if(error)
          reject(error);
        else if(!response)
          reject();
        else
          resolve(response);
      });

      _db.get.apply(_db, args);
    });
  };

  var __all__ = this.all = function()
  {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject)
    {
      args.push(function(error, rows)
      {
        if(error)
          reject(error);
        else
          resolve(rows);
      });

      _db.all.apply(_db, args);
    });
  };
}

module.export = {
  sqlitep: sqlitep
};
