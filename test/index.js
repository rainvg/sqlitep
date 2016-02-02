'use strict';

var assert = require('assert');
var sqlitep = require('../src/index.js');
var fs = require('fs');

describe('sqlitep', function()
{
  beforeEach(function()
  {
    try
    {
      fs.unlinkSync('.__sqlitep_test__.db');
    } catch(error) {}
  });

  afterEach(function()
  {
    try
    {
      fs.unlinkSync('.__sqlitep_test__.db');
    } catch(error) {}
  });

  it('should throw an error when constructor is invoked without new.', function()
  {
    var success = true;

    try
    {
      sqlitep.database('.__sqlitep_test__.db');
      success = false;
    }
    catch(error) {}

    assert(success);
  });

  it('should create a database with proper properties.', function()
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    assert(database.new());
    assert(database.path() === '.__sqlitep_test__.db');
  });

  it('should be able to run() queries and detect errors.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.run('create table `test` (`i` int, `j` int)').then(function()
    {
      return database.run('insert into `test` values(?, ?)', 1, 2);
    }).then(function()
    {
      return database.run('insert into `test` values(?, ?)', 3, 4);
    }).then(function()
    {
      return database.run('drop table `test`');
    }).then(function()
    {
      database.run('my malformed query!').then(function()
      {
        done(new Error('Malformed query succeeded.'));
      }).catch(function()
      {
        done();
      });
    }).catch(function()
    {
      done(new Error('Queries failed.'));
    });
  });

  it('should be able to get() items and return an error if nothing is found.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.run('create table `test` (`i` int, `j` int)').then(function()
    {
      return database.run('insert into `test` values(?, ?)', 1, 2);
    }).then(function()
    {
      return database.get('select `j` from `test` where `i` = ?', 1);
    }).then(function(response)
    {
      if(response.j !== 2) {done(new Error('Wrong response.')); return;}

      database.get('select `j` from `test` where `i` = ?', 12).then(function()
      {
        done(new Error('Non-existing item found.'));
      }).catch(function()
      {
        database.get('my malformed query!').then(function()
        {
          done(new Error('Malformed query succeeded.'));
        }).catch(function()
        {
          done();
        });
      });
    }).catch(function()
    {
      done(new Error('Queries failed.'));
    });
  });

  it('should be able to fetch multiple results with all().', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.run('create table `test` (`i` int, `j` int)').then(function()
    {
      return database.run('insert into `test` values(?, ?)', 1, 2);
    }).then(function()
    {
      return database.run('insert into `test` values(?, ?)', 3, 4);
    }).then(function()
    {
      return database.all('select `j` from `test` where i > ?', 0);
    }).then(function(responses)
    {
      if(responses.length !== 2 || responses[0].j !== 2 || responses[1].j !== 4) {done(new Error('Wrong response.')); return;}

      database.all('my malformed query!').then(function()
      {
        done(new Error('Malformed query succeeded.'));
      }).catch(function()
      {
        done();
      });
    }).catch(function()
    {
      done(new Error('Queries failed'));
    });
  });

  it('should be able to exec() multiple statements.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.exec('create table `test` (`i` int, `j` int); insert into `test` values(1, 2); insert into `test` values(2, 3);').then(function()
    {
      database.exec('my malformed query!').then(function()
      {
        done(new Error('Malformed query succeeded.'));
      }).catch(function()
      {
        done();
      });
    }).catch(function()
    {
      done(new Error('Queries failed.'));
    });
  });

  it('should be able to prepare() a statement.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.prepare('create table `test` (`i` int, `j` int);').then(function()
    {
      database.prepare('my malformed query!').then(function()
      {
        done(new Error('Malformed query preparation succeeded.'));
      }).catch(function()
      {
        done();
      });
    }).catch(function()
    {
      done(new Error('Statement prepare failed.'));
    });
  });
});
