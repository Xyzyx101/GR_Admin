(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('ProjectList', ProjectList);

  ProjectList.$inject = ['$q', '$rootScope', 'Auth', 'Cleaner'];

  /* @ngInject */
  function ProjectList($q, $rootScope, Auth, Cleaner) {
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
        project['id'] = key;
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
      for(const id in projectObj) {
        firebase.database().ref('/projects/'+id).once('value')
        .then(function(snapshot) {
          if(snapshot && snapshot.val()) {
            let project = snapshot.val();
            project['id'] = id;
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

    function getProject(id) {
      var deferred = $q.defer();
      firebase.database().ref('/projects/' + id).once('value')
      .then(function(snapshot) {
        if(snapshot && snapshot.val()) {
          let project = snapshot.val();
          project.id = id;
          project = changeTimestampsToDates(project);
          deferred.resolve(project);
        }
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function changeTimestampsToDates(proj) {
      if(proj.creationDate) {
        proj.creationDate = new Date(proj.creationDate);
      }
      if(proj.launchDate) {
        proj.launchDate = new Date(proj.launchDate);
      }
      if(proj.shutdownDate) {
        proj.shutdownDate = new Date(proj.shutdownDate);
      }
      return proj;
    }

    function createProject(proj) {
      var deferred = $q.defer();
      firebase.database().ref('/projects/' + proj.id).once('value')
      .then(function(snapshot) {
        if(snapshot && snapshot.val()) {
          deferred.reject(Error('Project with id ' + proj.id +' already exists'));
        } else {
          return saveProject(proj);
        }
      })
      return deferred.promise;
    }

    function saveProject(proj) {
      var deferred = $q.defer();
      const id = proj.id;
      delete proj.id;
      proj = Cleaner.ConvertDatesToTimestamps(proj);
      firebase.database().ref('/projects/'+id).set(proj)
      .then(function() {
        deferred.resolve(id + ' has been saved');
        $rootScope.$broadcast("ProjectList:Updated");
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function deleteProject(id) {
      var deferred = $q.defer();
      if(id===undefined || id=='') {
        deferred.reject(Error('project id is undefined'));
      } else {
        firebase.database().ref('/projects/'+id).once('value')
        .then(function(snapshot) {
          if(!snapshot || !snapshot.val()) {
            deferred.reject(Error('Project with ID ' + id +' does not exists'));
          }
        }).then(function() {
          firebase.database().ref('/projects/'+id).remove()
          .then(function(){
            deferred.resolve(id + ' has been deleted');
            $rootScope.$broadcast("ProjectList:Updated");
          }).catch(function(err) {
            deferred.reject(err);
          })
        }).catch(function(err) {
          deferred.reject(err);
        })
      }
      return deferred.promise;
    }

    function  getConfig(id) {
      var deferred = $q.defer();
      firebase.database().ref('/projectConfig/'+id).orderByKey().limitToLast(1).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          deferred.resolve(childSnapshot.val());
        });
      }).catch(function(err){
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function saveConfig(id, config) {
      var deferred = $q.defer();
      var configRef = firebase.database().ref('/projectConfig/'+id);
      var newConfig = configRef.push();
      newConfig.set(config)
      .then(function() {
        deferred.resolve('Project config for ' + id + ' saved');
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    return  {
      GetList: getList,
      CreateProject: createProject,
      GetProject: getProject,
      SaveProject: saveProject,
      DeleteProject: deleteProject,
      GetProjectConfig: getConfig,
      SaveProjectConfig: saveConfig
    };
  }
})();
