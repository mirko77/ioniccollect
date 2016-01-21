// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db = null;

angular.module('starter', ['ionic', 'ngCordova', 'login', 'projects', 'entries', 'project', 'question', 'add-project', 'view-entry', 'project-model', 'db-service', 'web-service'])

    .run(function ($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // Set up database tables
            db = $cordovaSQLite.openDB('my.db');
            // users table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, jwt text)");
            // projects table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS projects (id integer primary key, project_slug text, project_name text, data text, extra text)");
            // entries table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS entries (id integer primary key, project_slug text, project_ref text, uuid text, entry text)");
            // answers table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS answers (id integer primary key, uuid text, input_ref text, answer text)");
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'LoginCtrl'
            })

            .state('app.projects', {
                url: '/projects',
                views: {
                    'menuContent': {
                        templateUrl: 'js/projects/projects.html',
                        controller: 'ProjectsCtrl'
                    }
                }
            })

            .state('app.add-project', {
                url: '/add-project',
                views: {
                    'menuContent': {
                        templateUrl: 'js/add-project/add-project.html',
                        controller: 'AddProjectCtrl'
                    }
                }
            })

            .state('app.project', {
                url: '/projects/:slug',
                params: {
                    'slug': ''
                },
                views: {
                    'menuContent': {
                        templateUrl: 'js/project/project.html',
                        controller: 'ProjectCtrl'
                    },
                    'rightMenuContent': {
                        templateUrl: 'js/project/project.html',
                        controller: 'ProjectCtrl'
                    }
                }
            })

            .state('app.entries', {
                url: '/projects/:slug/entries',
                params: {
                    'slug': ''
                },
                views: {
                    'menuContent': {
                        templateUrl: 'js/entries/entries.html',
                        controller: 'EntriesCtrl'
                    }
                }
            })

            .state('app.view-entry', {
                //url: '/projects/:slug',
                params: {
                    slug: '',
                    entryUuid: ''
                },
                views: {
                    'menuContent': {
                        templateUrl: 'js/view-entry/view-entry.html',
                        controller: 'ViewEntryCtrl'
                    }
                }
            })

            .state('app.question', {
                //url: '/projects/:slug',
                params: {
                    'formRef': '',
                    'inputRef': '',
                    'inputIndex': 0
                },
                views: {
                    'menuContent': {
                        templateUrl: 'js/question/question.html',
                        controller: 'QuestionCtrl'
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/projects');
    })


    /* SERVICES */

    /**
     * Add Entry service
     */
    .service('addEntry', function ($ionicPlatform, $cordovaSQLite, DbService) {

        /**
         * Helper method to create a uuid
         *
         * @returns {string}
         */
        this.uuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        this.entryUuid = '';
        this.project = '';
        this.forms = [];
        this.formName = '';
        this.numForms = 0;
        this.currentFormIndex = 0;
        this.numInputsThisForm = 0;
        this.inputs = {};
        this.answers = [];
        this.currentFormRef = '';

        /**
         * Add project details to the add entry object
         *
         * @param project
         */
        this.addProject = function (project) {
            this.project = project;
        };

        /**
         * Initial function to set up the entry
         */
        this.setUp = function () {
            this.entryUuid = this.uuid();

            // get forms
            var forms = this.project.getExtraForms();
            this.numForms = forms.length;
            var inputs;

            var i = 0;
            // loop forms to get first
            for (var form in forms) {

                if (forms.hasOwnProperty(form)) {
                    this.forms[i] = {ref: form, form: forms[form]};

                    // set some class variables so we know our current form/input
                    if (i === 0) {
                        this.formName = forms[form].details.name;
                        this.currentFormRef = form;
                        this.currentFormIndex = form;
                        this.inputs = this.project.getFormInputs(form);
                        this.numInputsThisForm = this.inputs.length;
                    }

                    i++;
                }
            }
        };

        /**
         * Make the json Entry object
         *
         * @param answers
         * @returns {{data: {type: string, id: (string|*), entry_uuid: (string|*), attributes: {form: {ref: (string|*), type: string}}, relationships: {parent: {}, branch: {}}, created_at: string, device_id: string, jwt: null}}}
         */
        this.makeJsonEntry = function (answers) {

            var entryType = 'entry';
            var uuid = this.entryUuid;
            var branch = {};
            var parent = {};

            var entryJson = {
                data: {
                    type: 'entry',
                    id: uuid,
                    entry_uuid: uuid,
                    attributes: {
                        form: {
                            ref: this.currentFormRef,
                            type: 'hierarchy'
                        }
                    },
                    relationships: {
                        parent: parent,
                        branch: branch
                    },
                    created_at: '2015-11-30T11:07:26+00:00',
                    device_id: 'a2439aad10124340',
                    jwt: null
                }

            };

            entryJson.data[entryType] = answers;

            return entryJson;

        };

    });