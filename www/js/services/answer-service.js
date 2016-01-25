/**
 * Answer Service
 */
angular.module('answer-service', ['ionic'])
    .service('AnswerService', function ($ionicPlatform, StatusCodes, DbService, AnswerValidate, EntryService, ProjectModel) {

        this.validator = AnswerValidate;
        /**
         * Validate and save answers
         *
         * @param answer
         * @param inputDetails
         * @param wasJumped
         * @return boolean
         */
        this.saveAnswer = function (answer, inputDetails, wasJumped) {

            // Reset validator errors
            this.validator.reset();

            // Validate the answer
            this.validator.validate(inputDetails, answer);

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

            // Parse the answer for storing in the db
            var parsedAnswer = this.parseAnswerForSaving(answer, inputDetails.type);

            // Store the answer
            EntryService.addAnswer(inputDetails.ref,
                {
                    answer: parsedAnswer,
                    input_ref: inputDetails.ref,
                    was_jumped: wasJumped
                }
            );

            // success
            return true;

        };

        /**
         * Get answer for a question
         *
         * @param inputDetails
         */
        this.getAnswer = function (inputDetails) {

            var answerObject = EntryService.getAnswer(inputDetails.ref);

            // If we have an existing answer
            if (answerObject) {
                // Parse answer.answer for viewing
                answerObject.answer = this.parseAnswerForViewing(answerObject.answer, inputDetails.type);
                return answerObject;

            } else {

                // Return a default answer object
                return {
                    answer: '',
                    was_jumped: false,
                    input_ref: inputDetails.ref
                };

            }

        };

        /**
         * Parse an answer into a format readable by the View-Model
         * @param answer
         * @param type
         * @returns {*}
         */
        this.parseAnswerForViewing = function (answer, type) {

            // Do some cleansing on the answer.answer, relative to its question type
            // switch on the supplied type
            switch (type) {

                case 'checkbox':
                    // split checkbox answers into array
                    var answerArray = answer.split(',');
                    answer = {};
                    for (var i in answerArray) {
                        answer[answerArray[i]] = true;
                    }

                    break;

                case 'group':
                    // loop each group answer and parse
                    var groupAnswers = [];
                    var groupInputsExtra = ProjectModel.getExtraInputs();

                    for (var i = 0; i < answer.length; i++) {
                        var groupInputDetails = groupInputsExtra[answer[i].input_ref].data;
                        console.log('test answer: ' + answer[i].answer);
                        var testanswer = this.parseAnswerForViewing(answer[i].answer, groupInputDetails.type);

                        groupAnswers.push(
                            {
                                answer: testanswer,
                                input_ref: answer[i].input_ref,
                                was_jumped: answer[i].was_jumped
                            }
                        );
                    }

                    answer = groupAnswers;
                    break;

            }

            return answer;

        };

        /**
         * Parse an answer into a format for saving
         * @param answer
         * @param type
         * @returns {*}
         */
        this.parseAnswerForSaving = function (answer, type) {

            // Do some cleansing on the answer for insertion into the db
            // switch on the supplied type
            switch (type) {

                case 'checkbox':
                    // join checkbox answers into csv
                    var tempAnswer = [];
                    for (var i in answer) {
                        if (answer[i] == true) {
                            tempAnswer.push(i);
                        }
                    }
                    answer = tempAnswer.join(',');

                    break;

                case 'group':

                    var groupAnswers = [];
                    var groupInputsExtra = ProjectModel.getExtraInputs();

                    for (var i = 0; i < answer.length; i++) {
                        var groupInputDetails = groupInputsExtra[answer[i].input_ref].data;
                        groupAnswers.push(
                            {
                                answer: this.parseAnswerForSaving(answer[i].answer, groupInputDetails.type),
                                input_ref: answer[i].input_ref,
                                was_jumped: answer[i].was_jumped
                            }
                        );
                    }

                    answer = groupAnswers;
                    break;

            }

            return answer;

        };

    });