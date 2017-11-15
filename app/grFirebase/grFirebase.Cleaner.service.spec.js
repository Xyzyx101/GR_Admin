describe('Cleaner', function() {
  var Cleaner;
  beforeEach(function () {
    module('grFirebase');
    inject(function(_Cleaner_) {
      Cleaner = _Cleaner_;
    });
  });

  afterEach(function () {
    firebase.app().delete();
  });

  it('Should return boolean unchanged', function() {
    expect(Cleaner.Clean(true)).toBe(true);
    expect(Cleaner.Clean(false)).toBe(false);
  });

  it('Should return numbers unchanged', function() {
    expect(Cleaner.Clean(42)).toBe(42);
    expect(Cleaner.Clean(357.1234)).toBe(357.1234);
    expect(Cleaner.Clean(-1000.0)).toBe(-1000.0);
  });

  it('Should return null unchanged', function() {
    expect(Cleaner.Clean(null)).toBe(null);
  });

  it('Should return date/time unchanged', function() {
    var now = Date.now();
    expect(Cleaner.Clean(now)).toBe(now);
  });

  it('Should work with arrays', function() {
    var testMe = ['one','two','three'];
    expect(Cleaner.Clean(testMe)).toEqual(testMe);
  });

  it('Should work with objects', function() {
    var testMe = {'one':1,'two':2,'three':3};
    expect(Cleaner.Clean(testMe)).toEqual(testMe);
  });

  it('Should find and clean objects with bad properties', function() {
    // ".", "#", "$", "/", "[", or "]"
    var dirty1 = {'.':'bad', 'prop':'good'};
    var dirty2 = {'#':'bad', 'prop':'good'};
    var dirty3 = {'$':'bad', 'prop':'good'};
    var dirty4 = {'/':'bad', 'prop':'good'};
    var dirty5 = {'[':'bad', 'prop':'good'};
    var dirty6 = {']':'bad', 'prop':'good'};
    var clean = {'prop':'good'};
    expect(Cleaner.Clean(dirty1)).toEqual(clean);
    expect(Cleaner.Clean(dirty2)).toEqual(clean);
    expect(Cleaner.Clean(dirty3)).toEqual(clean);
    expect(Cleaner.Clean(dirty4)).toEqual(clean);
    expect(Cleaner.Clean(dirty5)).toEqual(clean);
    expect(Cleaner.Clean(dirty6)).toEqual(clean);
  });

  it('Should find and clean objects inside arrays', function() {
    // ".", "#", "$", "/", "[", or "]"
    var dirty1 = {'.':'bad', 'prop':'bacon'};
    var dirty2 = {'#':'bad', 'prop':'beans'};
    var dirty3 = {'$':'bad', 'prop':'whiskey'};
    var veryDirty = [dirty1, dirty2, dirty3]
    var clean = [{'prop':'bacon'},{'prop':'beans'},{'prop':'whiskey'}];
    expect(Cleaner.Clean(veryDirty)).toEqual(clean);
  });

  it('Should find and clean objects inside objects', function() {
    var veryDirty = {
      'obj1': {'.':'bad', 'prop':'bacon'},
      'obj2': {'#':'bad', 'prop':'beans'},
      'obj3': {'$':'bad', 'prop':'whiskey'}
    };
    var clean = {
      'obj1': {'prop':'bacon'},
      'obj2': {'prop':'beans'},
      'obj3': {'prop':'whiskey'}
    };
    expect(Cleaner.Clean(veryDirty)).toEqual(clean);
  });

  it('Should work with array properties', function() {
    var dirty1 = {'.':'bad', 'prop':'bacon'};
    var dirty2 = {'#':'bad', 'prop':'beans'};
    var dirty3 = {'$':'bad', 'prop':'whiskey'};
    var veryDirty = {'myArray': [dirty1, dirty2, dirty3] };
    var clean = {'myArray':[{'prop':'bacon'},{'prop':'beans'},{'prop':'whiskey'}]};
    expect(Cleaner.Clean(veryDirty)).toEqual(clean);
  })

  it('Should find and clean deeply nested objects', function() {
    var veryDirty = {
      'obj1': {'prop':'bacon'},
      'obj2': {'otherProp': {'#':'bad', 'prop':'beans'}},
      'obj3': {'otherOtherProp':  {'otherProp': {'#':'bad', 'prop':'whiskey'}},}
    };
    var clean = {
      'obj1': {'prop':'bacon'},
      'obj2': {'otherProp': {'prop':'beans'}},
      'obj3': {'otherOtherProp':  {'otherProp': {'prop':'whiskey'}},}
    };
    expect(Cleaner.Clean(veryDirty)).toEqual(clean);
  });

  it('Should find and clean arrays of arrays', function() {
    var dirty = {'.':'bad', 'prop':'bacon'};
    var veryDirty = [dirty, dirty, dirty]
    var superDirty = [veryDirty, veryDirty, veryDirty];

    var clean = {'prop':'bacon'};
    var veryClean = [clean, clean, clean];
    var superClean = [veryClean, veryClean, veryClean];

    expect(Cleaner.Clean(superDirty)).toEqual(superClean);
  });
});
