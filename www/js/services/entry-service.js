/**
 * Entry Service
 */
angular.module('entry-service', ['ionic'])
    .service('EntryService', function ($ionicPlatform, StatusCodes, DbService, AnswerValidate, ProjectModel) {

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
        this.project = ProjectModel;
        this.forms = [];
        this.formName = '';
        this.numForms = 0;
        this.currentFormIndex = 0;
        this.numInputsThisForm = 0;
        this.parentEntryUuid = '';
        this.inputs = {};
        this.answers = {};
        this.currentFormRef = '';
        this.branchEntries = [];
        this.media = [];
        this.validator = AnswerValidate;

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
            // add default answers for all questions in this entry
            this.addDefaultAnswers();

        };

        /**
         * Add default answers for all questions in this entry
         */
        this.addDefaultAnswers = function () {
            var inputsExtra = this.project.getExtraInputs();

            // now loop round and pre populate the answers for each question
            for (var i = 0; i < this.inputs.length; i++) {

                var inputDetails = inputsExtra[this.inputs[i]].data;

                switch (inputDetails.type) {

                    case 'group':

                        // add group answers to main group
                        var group = this.project.getFormGroups(this.currentFormRef);

                        this.answers[inputDetails.ref] = {answer: {}, was_jumped: false, type: inputDetails.type};
                        for (var j = 0; j < group[inputDetails.ref].length; j++) {

                            var groupInputDetails = inputsExtra[group[inputDetails.ref][j]].data;
                            switch (groupInputDetails.type) {

                                case 'checkbox':
                                    this.answers[inputDetails.ref].answer[groupInputDetails.ref] ={
                                        answer: {},
                                        was_jumped: false,
                                        type: groupInputDetails.type
                                    };
                                    break;
                                default:
                                    this.answers[inputDetails.ref].answer[groupInputDetails.ref] = {
                                        answer: '',
                                        was_jumped: false,
                                        type: groupInputDetails.type
                                    };
                            }
                        }
                        break;

                    case 'checkbox':
                        this.answers[inputDetails.ref] = {answer: {}, was_jumped: false, type: inputDetails.type};
                        break;

                    default:
                        // add any other type as normal
                        this.answers[inputDetails.ref] = {answer: '', was_jumped: false, type: inputDetails.type};

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

            entryJson.data[entryType] = answers;

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
         * Validate and add answer to 'answers' object
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
            console.log(answer);
            // store the answer
            this.answers[inputDetails.ref] = answer;

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
            return this.answers[inputRef];
        };

    });