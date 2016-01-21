angular.module('project', [])

    .controller('ProjectCtrl', function ($ionicPlatform, $scope, $stateParams, $state, WebService, ProjectModel, DbService) {


        $scope.show = function() {
            cordova.plugin.pDialog.init({
                //theme : 'HOLO_DARK',
                progressStyle : 'SPINNER',
                cancelable : false,
                title : 'Please Wait...',
                message : 'Loading Project...'
            });
        };

        $scope.hide = function() {
            cordova.plugin.pDialog.dismiss();
        };

        $scope.slug = $stateParams.slug;
        console.log($scope.slug);
        $scope.project = ProjectModel;

        $scope.getProject = function() {
            DbService.getProject($scope.slug).then(function(res) {

                // check if we have one
                if (res.rows.item(0)) {

                    var data = res.rows.item(0).data;
                    var extra = res.rows.item(0).extra;
                    $scope.data = data;
                    $scope.extra = extra;

                    $scope.project.initialise($scope.data, $scope.extra);

                    $scope.projectName = $scope.project.getProjectName();

                }

                console.log('hiiiiiiii theeeeerreeee');
                $scope.hide();

            });
        };


        $scope.projectsPage = function () {
            location.href = '#/app/projects';
        };

        $ionicPlatform.ready(function () {
            $scope.show();
            $scope.getProject();
        });

    });


