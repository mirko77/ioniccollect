/**
 * Entry Service
 */
angular.module('entry-service', ['ionic'])
    .service('EntryService', function ($ionicPlatform, StatusCodes, DbService) {

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
        this.answers = {};
        this.currentFormRef = '';
        this.branchEntries = [];
        this.media = [];

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

            // reset answers
            this.answers = {};
            
            // reset uuid
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
                    // if we don't have a form, we'll use the first form
                    if (i === 0 && !this.currentFormRef) {
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

        /**
         * Save an entry
         *
         * @param projectRef
         */
        this.saveEntry = function(projectRef) {

            var self = this;

            return new Promise(function (fulfill, reject) {

                // Make entry json from the answers
                var entry = self.makeJsonEntry(self.answers);
                // Save the entry in the database
                DbService.saveEntry(projectRef, self.entryUuid, entry).then(function (res) {

                    console.log(entry);
                    alert(StatusCodes.getMessage('ec5_79'));
                    fulfill(res);

                }, function (err) {
                    console.error(err);
                    reject(err);
                });


            });


        };

        /**
         * Add answer to 'answers' object
         *
         * @param inputRef
         * @param answer
         */
        this.addAnswer = function(inputRef, answer) {
            this.answers[inputRef] = answer;
        };

        /**
         * Return answer for a question
         *
         * @param inputRef
         * @returns {*}
         */
        this.getAnswer = function(inputRef) {
            console.log('entry get answer: ');
            console.log(this.answers);
            return this.answers[inputRef];
        };

    });