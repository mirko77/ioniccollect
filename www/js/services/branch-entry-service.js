/**
 * Branch Entry Service
 */
angular.module('branch-entry-service', ['ionic'])
    .service('BranchEntryService', function ($ionicPlatform, StatusCodes, DbService, AnswerValidate) {

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
        this.formName = '';
        this.numInputsThisForm = 0;
        this.ownerInputRef = '';
        this.ownerEntryUuid = '';
        this.inputs = {};
        this.branchAnswers = {};
        this.currentFormRef = '';
        this.media = [];
        this.validator = AnswerValidate;

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

            // reset branchAnswers
            this.branchAnswers = {};

            // reset uuid
            this.entryUuid = this.uuid();

            this.branchInputs = this.project.getBranches(this.currentFormRef, this.ownerInputRef);

            var inputsExtra = this.project.getExtraInputs();

            // now loop round and prepopulate the branchAnswers for each question
            for (var i = 0; i < this.inputs.length; i++) {

                var inputDetails = inputsExtra[this.inputs[i]].data;

                switch (inputDetails.type) {

                    case 'group':

                        // add group branchAnswers to main group
                        var group = this.project.getFormGroups(this.currentFormRef);

                        this.branchAnswers[inputDetails.ref] = {answer: [], input_ref: inputDetails.ref, was_jumped: false};
                        for (var j = 0; j < group[inputDetails.ref].length; j++) {

                            var groupInputDetails = inputsExtra[group[inputDetails.ref][j]].data;
                            switch (groupInputDetails.type) {

                                case 'checkbox':
                                    this.branchAnswers[inputDetails.ref].answer.push({
                                        answer: {},
                                        input_ref: groupInputDetails.ref,
                                        was_jumped: false
                                    });
                                    break;
                                default:
                                    this.branchAnswers[inputDetails.ref].answer.push({
                                        answer: '',
                                        input_ref: groupInputDetails.ref,
                                        was_jumped: false
                                    });
                            }
                        }

                        break;

                    case 'checkbox':
                        this.branchAnswers[inputDetails.ref] = {answer: {}, input_ref: inputDetails.ref, was_jumped: false};
                        break;

                    default:
                        // add any other type as normal
                        this.branchAnswers[inputDetails.ref] = {answer: '', input_ref: inputDetails.ref, was_jumped: false};

                }

            }

        };

        /**
         * Make the json Entry object
         *
         * @param branchAnswers
         * @returns {{data: {type: string, id: (string|*), entry_uuid: (string|*), attributes: {form: {ref: (string|*), type: string}}, relationships: {parent: {}, branch: {}}, created_at: string, device_id: string, jwt: null}}}
         */
        this.makeJsonEntry = function (branchAnswers) {

            var entryType = 'branch-entry';
            var uuid = this.entryUuid;
            var branch = {
                data : {
                    input_ref: this.ownerInputRef,
                    entry_uuid: this.ownerEntryUuid
                }
            };
            var parent = {};

            var entryJson = {
                data: {
                    type: entryType,
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

            entryJson.data[entryType] = branchAnswers;

            return entryJson;

        };

        /**
         * Save an entry
         *
         * @param projectRef
         */
        this.saveEntry = function (projectRef) {

            var self = this;

            return new Promise(function (fulfill, reject) {

                // Make entry json from the branchAnswers
                var entry = self.makeJsonEntry(self.branchAnswers);
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
         * Validate and add answer to 'branchAnswers' object
         *
         * @param answer
         * @param inputDetails
         */
        this.addAnswer = function (answer, inputDetails) {

            // Reset validator errors
            this.validator.reset();

            // Validate the answer
            this.validator.validate(inputDetails, answer.answer);

            // Check whether answer is valid
            if (this.validator.hasErrors()) {
                var errors = this.validator.getErrors();
                for (var error in errors) {
                    if (errors.hasOwnProperty(error)) {
                        alert('Error: ' + StatusCodes.getMessage(errors[error]));
                    }
                }
                return false;
            }

            // store the answer
            this.branchAnswers[inputDetails.ref] = answer;

            // success
            return true;

        };

        /**
         * Return answer for a question
         *
         * @param inputRef
         * @returns {*}
         */
        this.getAnswer = function (inputRef) {
            return this.branchAnswers[inputRef];
        };

    });