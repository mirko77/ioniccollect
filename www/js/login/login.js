angular.module('login', [])

    .controller('LoginCtrl', function ($ionicPlatform, $scope, $ionicModal, $cordovaNetwork, $ionicPopup, $timeout, WebService, DbService) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};
        $scope.ldapLoginData = {};
        $scope.action = 'Login';

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Determine which action needs to be taken
        $scope.actionFunction = function () {
            switch ($scope.action) {
                case 'Login':
                    $scope.login();
                    break;
                case 'Logout':
                    $scope.logout();
                    break;
            }
        };

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Logout
        $scope.logout = function () {
            DbService.removeToken().then(function() {
                $scope.action = 'Login';
            });

        };

        // Open the login modal
        $scope.login = function () {
            // check if we have a connection
            if($cordovaNetwork.isOffline()) {
                    alert('Please connect to the internet to login.');

            } else {
                $scope.modal.show();
            }

        };

        // Perform the local login action when the user submits the login form
        $scope.doLogin = function () {

            WebService.login($scope.loginData, 'local').success(function(data) {

                console.log(data.data.attributes.jwt);
                var jwt = data.data.attributes.jwt;

                DbService.saveToken(jwt).then(function() {
                    $scope.modal.hide();
                    $scope.action = 'Logout';
                });

            }).error(function(error) {
                for (var i = 0; i < error.errors.length; i++) {
                    alert(error.errors[i].title);
                }
            });

        };

        // Perform the ldap login action when the user submits the login form
        $scope.doLdapLogin = function () {

            WebService.login($scope.ldapLoginData, 'ldap').success(function(data) {

                console.log(data.data.attributes.jwt);
                var jwt = data.data.attributes.jwt;

                DbService.saveToken(jwt).then(function() {
                    $scope.modal.hide();
                    $scope.action = 'Logout';
                });

            }).error(function(error) {
                for (var i = 0; i < error.errors.length; i++) {
                    alert(error.errors[i].title);
                }
            });

        };

        $scope.doGoogleLogin = function() {

            // access login page via redirect performed server side
            var browserRef = cordova.InAppBrowser.open("http://vps140384.ovh.net/five/api/json/login/google", "blank", "location=no,clearsessioncache=yes,clearcache=yes");

            browserRef.addEventListener("exit", function (event) {
                console.log("The Google sign in flow was canceled");
            });

            // when loading is complete, attempt to retrieve jwt token, if user was authorised
            browserRef.addEventListener("loadstop", (event) => {

                // if the url is that of our api call
                if ((event.url).indexOf("http://vps140384.ovh.net/five/api/json/handle/google") === 0) {

                    browserRef.executeScript({
                        code: "document.body.innerHTML"
                    }, function(data) {

                        // attempt to retrieve message from the in app browser
                        var message = JSON.parse(data[0].replace(/(<([^>]+)>)/ig,""));
                        console.log(message);
                        browserRef.removeEventListener("exit", (event) => {});
                        browserRef.close();

                        // check if we have a jwt token
                        if (message.data) {
                            var jwt = message.data.attributes.jwt;
                            DbService.saveToken(jwt).then(function() {
                                $scope.modal.hide();
                                $scope.action = 'Logout';
                            });
                        }
                        // check if we have any errors
                        var errors = message.errors;
                        if (errors) {
                            for (var i = 0; i < errors.length; i++) {
                                alert(errors[i].title);
                            }
                        }

                    });

                }

            });


        };

        $ionicPlatform.ready(function () {

            // attempt to retrieve the jwt token
            DbService.getToken().then(function (res) {

                // check if we have one
                if (res.rows.item(0)) {

                    // if we do, then the action is to 'logout'
                    $scope.action = 'Logout';

                }

            });
        });
    });
