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

  // Forwarding interface

  var __prepare__ = this.prepare = function()
  {
    return _db.prepare.apply(_db, arguments);
  }

  var __each__ = this.each = function()
  {
    return _db.each.apply(_db, arguments);
  }

  var __map__ = this.map = function()
  {
    return _db.map.apply(_db, arguments);
  }

  var __addListener__ = this.addListener = function()
  {
    return _db.addListener.apply(_db, arguments);
  }

  var __removeListener__ = this.removeListener = function()
  {
    return _db.removeListener.apply(_db, arguments);
  }

  var __removeAllListeners__ = this.removeAllListeners = function()
  {
    return _db.removeAllListeners.apply(_db, arguments);
  }
}

module.export = {
  sqlitep: sqlitep
};
