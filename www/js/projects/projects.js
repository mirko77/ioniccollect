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
                $scope.projects.push({slug: res.rows.item(i).project_slug, title: res.rows.item(i).project_name});
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

    $ionicPlatform.ready(function () {

        $scope.getProjects();
    });


});

