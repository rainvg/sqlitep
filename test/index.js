'use strict';

var assert = require('assert');
var sqlitep = require('../src/index.js');
var fs = require('fs');

describe('sqlitep.database', function()
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

  it('should be created with proper properties.', function()
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

  it('should be able to get() items and throw an error if nothing is found.', function(done)
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

  it('should be able to fetch multiple results with all() and detect errors.', function(done)
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

  it('should be able to exec() multiple statements and detect errors.', function(done)
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

  it('should be able to prepare() a statement and detect errors.', function(done)
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

describe('sqlitep.statement', function()
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

  it('should be able to run().', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.prepare('create table `test`(`i` int, `j` int)').then(function(statement)
    {
      return statement.run();
    }).then(function()
    {
      return database.prepare('drop table `test`');
    }).then(function(statement)
    {
      return statement.run();
    }).then(function()
    {
      done();
    }).catch(function()
    {
      done(new Error('Queries failed.'));
    });
  });

  it('should be able to bind to multiple values.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.run('create table `test` (`i` int, `j` int)').then(function()
    {
      return database.prepare('insert into `test` values(?, ?)');
    }).then(function(statement)
    {
      statement.bind(1, 2).then(function()
      {
        return statement.run();
      }).then(function()
      {
        return statement.bind(3, 4);
      }).then(function()
      {
        return statement.run();
      }).then(function()
      {
        done();
      }).catch(function()
      {
        done(new Error('Multiple bind failed.'));
      });
    }).catch(function()
    {
      done(new Error('Preparation failed.'));
    });
  });

  it('should be able to get() values and throw an error if nothing is found.', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.exec('create table `test` (`i` int, `j` int); insert into `test` values(1, 2);').then(function()
    {
      return database.prepare('select `j` from `test` where `i` = ?');
    }).then(function(statement)
    {
      statement.bind(1).then(function()
      {
        return statement.get();
      }).then(function(response)
      {
        if(response.j !== 2) {done(new Error('Wrong response')); return;}

        statement.bind(2).then(function()
        {
          return statement.get();
        }).then(function()
        {
          done(new Error('Non-existing item found.'));
        }).catch(function()
        {
          done();
        });
      }).catch(function()
      {
        done(new Error('Query failed.'));
      });
    }).catch(function()
    {
      done(new Error('Preparation failed.'));
    });
  });

  it('should be able to fetch multiple values with all().', function(done)
  {
    var database = new sqlitep.database('.__sqlitep_test__.db');

    database.exec('create table `test` (`i` int, `j` int); insert into `test` values(1, 2); insert into `test` values(3, 4);').then(function()
    {
      return database.prepare('select `j` from `test`');
    }).then(function(statement)
    {
      return statement.all();
    }).then(function(responses)
    {
      if(responses.length !== 2 || responses[0].j !== 2 || responses[1].j !== 4)
        done(new Error('Wrong response.'));
      else
        done();
    }).catch(function()
    {
      done(new Error('Queries failed.'));
    });
  });
});
