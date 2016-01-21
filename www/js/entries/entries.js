

angular.module('entries', [])

    .controller('EntriesCtrl', function($ionicPlatform, $scope, $stateParams, $state, ProjectModel, DbService, addEntry) {

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

        $scope.project = ProjectModel;
        $scope.slug = $scope.project.getSlug();
        $scope.DbService = DbService;

        addEntry.addProject($scope.project);

        $scope.projectName = $scope.project.getProjectName();


        /**
         * Show the entries for this project's main form
         */
        $scope.showEntries = function() {

            $scope.DbService.getEntriesForProject($scope.slug).then(function(res) {

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
            $state.go('app.view-entry', {slug: $scope.slug, entryUuid: entry.title});

        };

        /**
         * Start the process of adding an entry
         * Initialise the main entry variables
         * Add the first question
         */
        $scope.addEntry = function() {

            addEntry.setUp();
            $state.go('app.question', {slug: $scope.slug, formRef: addEntry.currentFormRef, inputRef: '', inputIndex: 0});

        };


        $ionicPlatform.ready(function () {
            // show the entries for this project
            $scope.show();
            $scope.showEntries();

        });



    });



//
//
//export class EntriesPage {
//
//    /**
//     *
//     * @param app
//     * @param nav
//     * @param navParams
//     * @param dataService
//     * @param project
//     * @param dataEntries
//     * @param dataProjects
//     */
//    constructor(app:IonicApp, nav:NavController, navParams:NavParams, dataService: DataService, project:Project, dataEntries: DataEntries, dataProjects: DataProjects) {
//
//        this.nav = nav;
//        this.project = project;
//        this.dataService = dataService;
//        this.dataEntries = dataEntries;
//        this.dataProjects = dataProjects;
//
//
//        // If we navigated to this page, we will have an item available as a nav param
//        this.selectedItem = navParams.get('item');
//        this.form = navParams.get('form');
//        this.formName = this.form.details.name;
//        this.projectName = this.project.extra_structure.project.details.name;
//        this.items = [];
//
//        this.showEntries(this.selectedItem.slug);
//
//    }
//

//

//
//    viewEntry(event, item) {
//        this.nav.push(ViewEntry, {item: item});
//    }
//
//
//}