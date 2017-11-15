(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('ProjectList', ProjectList);

  ProjectList.$inject = ['$q', 'Auth'];

  /* @ngInject */
  function ProjectList($q, Auth) {
    function getList() {
      let userDetails = Auth.UserDetails();
      if(userDetails.admin) {
        return getAllProjects();
      } else {
        return getUserProjects();
      }
    }

    function getAllProjects() {
      var deferred = $q.defer();
      firebase.database().ref('projects/').once('value')
      .then(function(snapshot) {
        return mungeProjectsIntoArray(snapshot.val());
      }).then(function(projectList) {
        deferred.resolve(projectList);
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function mungeProjectsIntoArray(projectObject) {
      var deferred = $q.defer();
      var projectList = [];
      for (var key in projectObject) {
        if(!projectObject.hasOwnProperty(key)) { continue; };
        var project = projectObject[key];
        project.projectId = key;
        projectList.push(project);
      }
      deferred.resolve(projectList);
      return deferred.promise;
    }

    function getUserProjects() {
      var deferred = $q.defer();
      let projectObj = Auth.UserDetails().projectAdmin;
      let projectCount = 0;
      for(const proj in projectObj) {
        if(projectObj.hasOwnProperty(proj)){
          ++projectCount;
        }
      }
      let projects = [];
      let startTime = Date.now();
      for(const projectId in projectObj) {
        firebase.database().ref('/projects/'+projectId).once('value')
        .then(function(snapshot) {
          if(snapshot && snapshot.val()) {
            let project = snapshot.val();
            project.projectId = projectId;
            projects.push(project);
            if(projects.length===projectCount) {
              deferred.resolve(projects);
            } else if(Date.now() - startTime > 10000) {
              deferred.reject(Error('getUserProjects has timed out'));
            }
          }
        }).catch(function(err) {
          deferred.reject(err);
        })
      }
      return deferred.promise;
    }

    function getOneProject(projId) {

    }

    function createProject(proj) {
      var deferred = $q.defer();
      return deferred.promise;
    }

    function deleteProject(projId) {
      var deferred = $q.defer();
      return deferred.promise;
    }

    return  {
      GetList: getList,
      CreateProject: createProject,
      DeleteProject: deleteProject
    };
  }
})();
