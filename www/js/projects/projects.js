angular.module('projects', [])

.controller('ProjectsCtrl', function($ionicPlatform, $scope, $state, DbService) {

    $scope.projects = [];
    $scope.DbService = DbService;

    /**
     * Get the projects saved in storage
     */
    $scope.getProjects = function() {

        $scope.DbService.getProjects().then(function(res) {

            for (var i = 0; i < res.rows.length; i++) {
                console.log(res.rows.item(i).ref);
                $scope.projects.push({project_ref: res.rows.item(i).ref, project_name: res.rows.item(i).name});
            }

            $scope.$apply()

        });

    };

    /**
     * Go to add project page
     */
    $scope.addProject = function() {

        $state.go('app.add-project');

    };

    /**
     * Got to a project page
     *
     * @param projectRef
     */
    $scope.goToProject = function(projectRef) {
        $state.go('app.project', {project_ref: projectRef});
    };

    $ionicPlatform.ready(function () {

        $scope.getProjects();
    });


});

