// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db = null;

angular.module('starter', ['ionic', 'ngCordova', 'login', 'projects', 'entries', 'project',
                            'question', 'add-project', 'view-entry', 'project-model', 'db-service',
                            'web-service', 'entry-service', 'answer-service'])

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

            // projects table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS projects (id integer primary key, name text, slug text, logo_thumb text, ref text, json_structure text, json_extra text, server_url text, last_updated text)");

            // users table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, jwt text)");

            // entries table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS entries (id integer primary key, entry_uuid text, parent_uuid text, project_ref text, form_ref text, json_structure text, created_at text, title text, synced text, can_edit text, is_remote text)");

            // branch entries table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS branch_entries (id integer primary key, branch_entry_uuid text, owner_entry_uuid text, owner_input_ref text, project_ref text, form_ref text, json_structure text, created_at text, title text, synced text, can_edit text, is_remote text)");

            // media table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS media (id integer primary key, entry_uuid text, input_ref text, project_ref text, form_ref text, file_name text, file_path text, file_type text, synced text)");

            // settings table
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS settings (id integer primary key, field text, value text)");


            // answers table
            //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS answers (id integer primary key, uuid text, input_ref text, answer text)");
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
                url: '/projects/:project_ref/entries',
                params: {
                    'project_ref': ''
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
    });