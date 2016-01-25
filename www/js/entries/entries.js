

angular.module('entries', [])

    .controller('EntriesCtrl', function($ionicPlatform, $scope, $stateParams, $state, ProjectModel, DbService, EntryService) {

        $scope.show = function() {
            cordova.plugin.pDialog.init({
                //theme : 'HOLO_DARK',
                progressStyle : 'SPINNER',
                cancelable : false,
                title : 'Please Wait...',
                message : 'Loading Entries...'
            });
        };

        $scope.hide = function() {
            cordova.plugin.pDialog.dismiss();
        };

        $scope.entries = [];
        $scope.DbService = DbService;
        $scope.project = ProjectModel;
        $scope.projectRef = $stateParams.project_ref;
        $scope.projectName = '';

        /**
         * Retrieve the project and entries
         */
        $scope.getProjectAndEntries = function() {

            DbService.getProject($scope.projectRef).then(function(res) {

                console.log(res);

                // check if we have one
                if (res.rows.item(0)) {

                    $scope.json_structure = res.rows.item(0).json_structure
                    $scope.json_extra = res.rows.item(0).json_extra;
                    $scope.project.initialise($scope.json_structure, $scope.json_extra);
                    EntryService.addProject($scope.project);
                    $scope.projectName = $scope.project.getProjectName();

                    console.log($scope.project);
                    // now retrieve and show the entries
                    $scope.showEntries();
                } else {
                    $scope.hide();
                }


            });
        };

        /**
         * Show the entries for this project's main form
         */
        $scope.showEntries = function() {

            $scope.DbService.getEntriesForProject($scope.projectRef).then(function(res) {

                for (var i = 0; i < res.rows.length; i++) {
                    $scope.entries.push({title: res.rows.item(i).uuid});
                }

                $scope.$apply();
                $scope.hide();

            });

        };

        /**
         * View an entry
         */
        $scope.viewEntry = function(entry) {

            console.log(entry);
            $state.go('app.view-entry', {project_ref: $scope.projectRef, entryUuid: entry.title});

        };

        /**
         * Start the process of adding an entry
         * Initialise the main entry variables
         * Add the first question
         */
        $scope.addEntry = function() {

            EntryService.setUp();
            $state.go('app.question', {project_ref: $scope.projectRef, formRef: EntryService.currentFormRef, inputRef: '', inputIndex: 0});

        };

        /**
         * Go to Projects page
         */
        $scope.projectsPage = function () {
            location.href = '#/app/projects';
        };

        $ionicPlatform.ready(function () {

            $scope.show();
            // retrieve the project then the entries
            $scope.getProjectAndEntries();

        });

    });
