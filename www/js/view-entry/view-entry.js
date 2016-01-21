angular.module('view-entry', [])

    .controller('ViewEntryCtrl', function($scope, $state, $ionicPlatform, $ionicHistory, $stateParams, WebService, DbService) {

        $scope.entryUuid = $stateParams.entryUuid;
        $scope.slug = $stateParams.slug;
        $scope.DbService = DbService;
        $scope.entry = null;

        /**
         * View this entry answers
         */
        $scope.viewAnswers = function() {

            $scope.DbService.getEntry($scope.entryUuid).then(function(data) {
                console.log(data.rows.item(0).entry);
                $scope.entry = JSON.parse(data.rows.item(0).entry).data;
            });

        };

        /**
         * Search for projects
         */
        $scope.uploadEntry = function() {

            // attempt to retrieve the jwt token
            DbService.getToken().then(function(res) {

                // check if we have one and add to entry
                if (res.rows.item(0)) {
                    $scope.entry.jwt = res.rows.item(0).jwt;

                }

                WebService.uploadEntry($scope.slug, $scope.entry).success(function (data) {

                    alert('Entry Uploaded!');


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

        // When platform is ready, load questions and answers
        $ionicPlatform.ready(function () {

            $scope.viewAnswers();

        });


    });

