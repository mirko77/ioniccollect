/**
 * Web service
 */
angular.module('web-service', ['ionic'])

    .service('WebService', function ($http, DbService) {

        //var webservice_url = "http://192.168.43.18/Sites/ec5/code/public/api/json";
        var webservice_url = "http://vps140384.ovh.net/five/api/json";

        /**
         * Get a project (posting jwt token, if available)
         *
         * @param slug
         * @param jwt
         * @returns {*}
         */
        this.getProject = function (slug, jwt) {

            var data = {action: 'show', type: 'project', jwt: jwt, project: [{project: slug}]};

            return $http({
                method: 'POST',
                url: webservice_url + '/project/' + slug,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {data}
            });

        };

        /**
         * Search for a project
         *
         * @param searchTerm
         * @returns {*}
         */
        this.searchForProject = function (searchTerm) {
            return $http.get(webservice_url + "/projects/" + searchTerm);
        };

        /**
         *
         * Upload an entry to the serve
         *
         * @param slug
         * @param data
         * @returns {*}
         */
        this.uploadEntry = function (slug, data) {

            return $http({
                method: 'POST',
                url: webservice_url + '/upload/' + slug,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {data}
            });

        };

        /**
         *
         * Upload an entry to the serve
         *
         * @param data
         * @param type
         * @returns {*}
         */
        this.login = function (data, type) {

            return $http({
                method: 'POST',
                url: webservice_url + '/login' + '/' + type,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {username: data.username, password: data.password}
            });
        }

    });