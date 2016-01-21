angular.module('add-project', [])

    .controller('AddProjectCtrl', function ($scope, $state, $ionicHistory, WebService, DbService) {

        $scope.searchTerm = {search: ''};
        $scope.projects = [];
        $scope.DbService = DbService;

        /**
         * Add a project
         *
         * @param slug
         * @param name
         */
        $scope.addProject = function (slug, name) {

            // attempt to retrieve the jwt token
            DbService.getToken().then(function(res) {

                var jwt = null;

                // check if we have one
                if (res.rows.item(0)) {
                    var jwt = res.rows.item(0).jwt;
                }

                WebService.getProject(slug, jwt).success(function (data) {
                    $scope.data = data;
                    console.log(data);

                    $scope.DbService.saveProject(slug, name, data.data, data.extraJson).then(function () {


                        alert('Project "' + name + '" added.');

                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.projects');
                    });


                }).error(function (error) {
                    // check if the user just needs to login to view this project
                    var needsToLogin = false;
                    for (var i = 0; i < error.errors.length; i++) {
                        // check for error ec5_77 (private project, user needs to login)
                        if (error.errors[i].code == 'ec5_77') {
                            needsToLogin = true;
                        }
                        alert(error.errors[i].title);
                    }

                    // if the user does need to login, present them with the login screen
                    if (needsToLogin) {
                        $scope.modal.show();
                    }

                });

            });


        };

        /**
         * Search for projects
         */
        $scope.search = function () {

            // reset projects array for each search
            $scope.projects = [];

            console.log($scope.searchTerm.search);
            WebService.searchForProject($scope.searchTerm.search).success(function (data) {

                // loop round and add to projects array
                for (var i = 0; i < data.data.length; i++) {
                    $scope.projects.push(data.data[i]);
                }
            });

        };


    });

