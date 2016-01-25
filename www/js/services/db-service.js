/**
 * Database service
 */
angular.module('db-service', ['ionic'])
    .service('DbService', function ($ionicPlatform, $cordovaSQLite) {

        /**
         * Function to save a project
         *
         * @param projectSlug
         * @param projectName
         * @param projectRef
         * @param jsonStructure
         * @param jsonExtra
         * @returns {Promise}
         */
        this.saveProject = function (projectSlug, projectName, projectRef, jsonStructure, jsonExtra) {

            var self = this;
            var query = "INSERT INTO projects (slug, name, ref, json_structure, json_extra) VALUES (?,?,?,?,?)";

            return new Promise(function (fulfill, reject) {

                $cordovaSQLite.execute(db, query, [projectSlug, projectName, projectRef, jsonStructure, jsonExtra]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });

        };

        /**
         * Function to get answers for an entry
         *
         * @param projectRef
         * @returns {Promise}
         */
        this.getEntriesForProject = function (projectRef) {

            var query = "SELECT entry_uuid FROM entries WHERE project_ref = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [projectRef]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to get an entry
         *
         * @param entryUuid
         * @returns {Promise}
         */
        this.getEntry = function (entryUuid) {

            var query = "SELECT json_structure FROM entries WHERE entry_uuid = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [entryUuid]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to get all stored projects
         *
         * @returns {Promise}
         */
        this.getProjects = function () {

            var query = "SELECT ref, name FROM projects";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to get a stored project
         *
         * @param projectRef
         * @returns {Promise}
         */
        this.getProject = function (projectRef) {

            var query = "SELECT json_structure, json_extra FROM projects WHERE ref = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [projectRef]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to save a jwt token
         *
         * @param jwt
         * @returns {Promise}
         */
        this.saveToken = function (jwt) {

            var query = "INSERT INTO users (jwt) VALUES (?)";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [jwt]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };


        /**
         * Function get stored jwt
         *
         * @returns {Promise}
         */
        this.getToken = function () {

            var query = "SELECT jwt FROM users";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to remove stored jwt
         *
         * @returns {Promise}
         */
        this.removeToken = function () {

            var query = "DELETE FROM users";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        ///**
        // * Function to remove stored jwt
        // *
        // * @returns {Promise}
        // */
        //this.getAnswer = function (entryUuid, inputRef) {
        //
        //    var query = "SELECT answer FROM answers WHERE uuid = ? AND input_ref = ?";
        //
        //    return new Promise(function (fulfill, reject) {
        //        $cordovaSQLite.execute(db, query, [entryUuid, inputRef]).then(function (res) {
        //
        //            fulfill(res);
        //
        //        }, function (err) {
        //            console.error(err);
        //            reject(err);
        //        });
        //
        //    });
        //};

        ///**
        // * Function to save an answer
        // *
        // * @param entryUuid
        // * @param inputRef
        // * @param answer
        // */
        //this.saveAnswer = function (entryUuid, inputRef, answer) {
        //    var self = this;
        //    var query = "INSERT INTO answers (uuid, input_ref, answer) VALUES (?,?,?)";
        //
        //    return new Promise(function (fulfill, reject) {
        //        $cordovaSQLite.execute(db, query, [entryUuid, inputRef, JSON.stringify(answer)]).then(function (res) {
        //
        //            fulfill(res);
        //
        //        }, function (err) {
        //            console.error(err);
        //            reject(err);
        //        });
        //    });
        //
        //};
        //
        ///**
        // * Function to get answers for an entry
        // *
        // * @param entryUuid
        // * @returns {Promise}
        // */
        //this.getAnswers = function (entryUuid) {
        //    var query = "SELECT input_ref,answer FROM answers WHERE uuid = ?";
        //
        //    return new Promise(function (fulfill, reject) {
        //
        //        $cordovaSQLite.execute(db, query, [entryUuid]).then(function (res) {
        //
        //            fulfill(res);
        //
        //        }, function (err) {
        //            console.error('error has happened: ' + err);
        //            reject(err);
        //        });
        //
        //    });
        //
        //};

        /**
         * Function to save a complete entry
         *
         * @param projectRef
         * @param entryUuid
         * @param entryJson
         * @returns {Promise}
         */
        this.saveEntry = function (projectRef, entryUuid, entryJson) {

            var self = this;
            var query = "INSERT INTO entries (project_ref, entry_uuid, json_structure) VALUES (?,?,?)";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [projectRef, entryUuid, JSON.stringify(entryJson)]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });

        };

    });