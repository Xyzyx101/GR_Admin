describe('Project Service', function() {

  var regularUser = {
    authenticated: true,
    uid: 'regularUser',
    name: 'Joe Guy',
    email: 'joeGuy@somewhere.com',
    admin: false,
    adminProjects: ['a', 'c']
  };

  // var adminUser = {
  //   authenticated: true,
  //   uid: 'imAnAdmin',
  //   name: 'Joe Admin',
  //   email: 'joeAdmin@somewhere.com',
  //   admin: true
  // };
  //
  // var testProjectList = {
  //   a: {},
  //   b: {},
  //   c: {}
  // }

  // The MockFirebase is only because the grModule will attempt to connect to the real DB by defualt and I don't want it to in a unit test.
  beforeEach(function () {
    jasmine.addCustomEqualityTester(angular.equals);
    //firebasemock.MockFirebase.override();
    module('firebase');
  });

  afterEach(function () {
    firebase.app().delete();
  });

  describe('mock firebase', function() {
    beforeEach(function () {
      module('grFirebase');
    });
    it('should return a list promise', inject(function(ProjectList) {
      expect(ProjectList.GetList).toBeDefined();
      expect(typeof(ProjectList.GetList) == 'function').toBe(true);
      var promise = ProjectList.GetList(regularUser);
      expect(promise).toBeDefined();
      expect(promise.constructor.name).toBe('Promise');
    }));

    it('should return a Create promise', inject(function(ProjectList) {
      expect(ProjectList.CreateProject).toBeDefined();
      expect(typeof(ProjectList.CreateProject) == 'function').toBe(true);
      var promise = ProjectList.CreateProject(regularUser);
      expect(promise).toBeDefined();
      expect(promise.constructor.name).toBe('Promise');
    }));

    it('should return a Delete promise', inject(function(ProjectList) {
      expect(ProjectList.DeleteProject).toBeDefined();
      expect(typeof(ProjectList.DeleteProject) == 'function').toBe(true);
      var promise = ProjectList.DeleteProject(null);
      expect(promise).toBeDefined();
      expect(promise.constructor.name).toBe('Promise');
    }));

    // it('GetProjectList should return the full list for an administrator', inject(function(Project, $rootScope) {
    //   var db = firebase.database().ref('projects/');
    //   db.set(testProjectList);
    //   db.flush();
    //   var resolvedProjectList;
    //   Project.GetProjectList(adminUser)
    //   .then(function(projectList) {
    //     resolvedProjectList = projectList;
    //   }).catch(function(err) {
    //     fail(err);
    //   });
    //   $rootScope.$apply(); // resolves promises
    //   expect(resolvedProjectList).toBe(testProjectList);
    // }));
    // it('GetProjectList should return a partial list for an administrator', function() {
    //   Project.GetProjectList(regularUser);
    // });
    //
    // it('CreateProject should create a project', function() {
    //
    // });
    //
    // it('DeleteProject should delete a project', function() {
    //
    // });
  });
});
