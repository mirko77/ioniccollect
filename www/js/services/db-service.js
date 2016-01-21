/**
 * Database service
 */
angular.module('db-service', ['ionic'])
    .service('DbService', function ($ionicPlatform, $cordovaSQLite) {

        /**
         * Function to save a project
         *
         * @param slug
         * @param name
         * @param data
         * @param extra
         * @returns {Promise}
         */
        this.saveProject = function (slug, name, data, extra) {

            var self = this;
            var query = "INSERT INTO projects (project_slug, project_name, data, extra) VALUES (?,?,?,?)";

            return new Promise(function (fulfill, reject) {

                $cordovaSQLite.execute(db, query, [slug, name, data, extra]).then(function (res) {

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
         * @param slug
         * @returns {Promise}
         */
        this.getEntriesForProject = function (slug) {

            var query = "SELECT uuid FROM entries WHERE project_slug = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [slug]).then(function (res) {

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

            var query = "SELECT entry FROM entries WHERE uuid = ?";

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

            var query = "SELECT project_slug, project_name FROM projects";

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
         * @returns {Promise}
         */
        this.getProject = function (slug) {

            var query = "SELECT data, extra FROM projects WHERE project_slug = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [slug]).then(function (res) {

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

        /**
         * Function to remove stored jwt
         *
         * @returns {Promise}
         */
        this.getAnswer = function (entryUuid, inputRef) {

            var query = "SELECT answer FROM answers WHERE uuid = ? AND input_ref = ?";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [entryUuid, inputRef]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });
        };

        /**
         * Function to save an answer
         *
         * @param entryUuid
         * @param inputRef
         * @param answer
         */
        this.saveAnswer = function (entryUuid, inputRef, answer) {
            var self = this;
            var query = "INSERT INTO answers (uuid, input_ref, answer) VALUES (?,?,?)";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [entryUuid, inputRef, JSON.stringify(answer)]).then(function (res) {
                    console.log("INSERT ID -> " + res);
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
         * @param entryUuid
         * @returns {Promise}
         */
        this.getAnswers = function (entryUuid) {
            var query = "SELECT input_ref,answer FROM answers WHERE uuid = ?";

            return new Promise(function (fulfill, reject) {

                $cordovaSQLite.execute(db, query, [entryUuid]).then(function (res) {

                    //if (res.rows.length > 0) {
                    //
                    //    for (var i = 0; i < res.rows.length; i++) {
                    //        answers.push(JSON.parse(res.rows.item(i).answer));
                    //    }
                    //
                    //}
                    fulfill(res);


                }, function (err) {
                    console.error('error has happened: ' + err);
                    reject(err);
                });

            });

        };

        /**
         * Function to save a complete entry
         *
         * @param slug
         * @param entryUuid
         * @param entry
         * @returns {Promise}
         */
        this.saveEntry = function (slug, entryUuid, entry) {

            var self = this;
            var query = "INSERT INTO entries (project_slug, uuid, entry) VALUES (?,?,?)";

            return new Promise(function (fulfill, reject) {
                $cordovaSQLite.execute(db, query, [slug, entryUuid, JSON.stringify(entry)]).then(function (res) {

                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });

            });

        };

    });