/**
 * Answer Service
 */
angular.module('answer-service', ['ionic'])
    .service('AnswerService', function ($ionicPlatform, StatusCodes, DbService, AnswerValidate) {

        this.validator = AnswerValidate;
        /**
         * Validate and save answers
         *
         * @param wasJumped
         * @return boolean
         */
        this.saveAnswer = function (wasJumped) {

            var answer = $scope.answer.answer;

            // Reset validator errors
            this.validator.reset();

            // Validate the answer
            this.validator.validate($scope.inputDetails, answer);

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
            answer = $scope.parseAnswerForDb(answer, $scope.type);

            // Store the answer
            DbService.saveAnswer($scope.EntryService.entryUuid, $scope.currentInputRef,
                {
                    answer: answer,
                    input_ref: $scope.answer.input_ref,
                    was_jumped: wasJumped
                }
            );

            // success
            return true;

        };

        /**
         * Get answer for this question
         */
        this.getAnswer = function () {

            //// Check the database for any stored answer for this question
            DbService.getAnswer($scope.EntryService.entryUuid, $scope.currentInputRef).then(function (res) {

                // if we have a stored answer in the db
                if (res.rows.length > 0) {

                    var dbAnswer = JSON.parse(res.rows.item(0).answer);
                    // parse the answer from the db into correct format for reading
                    $scope.answer.answer = $scope.parseAnswerForVM(dbAnswer.answer, $scope.type);

                }

            });

        };

        /**
         * Parse an answer into a format readable by the View-Model
         * @param answer
         * @param type
         * @returns {*}
         */
        this.parseAnswerForVM = function (answer, type) {

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
                    var groupInputsExtra = $scope.project.getExtraInputs();

                    for (var i = 0; i < answer.length; i++) {
                        var groupInputDetails = groupInputsExtra[answer[i].input_ref].data;
                        groupAnswers.push(
                            {
                                answer: $scope.parseAnswerForVM(answer[i].answer, groupInputDetails.type),
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
         * Parse an answer into a format readable by the database
         * @param answer
         * @param type
         * @returns {*}
         */
        this.parseAnswerForDb = function (answer, type) {

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
                    var groupInputsExtra = $scope.project.getExtraInputs();

                    for (var i = 0; i < answer.length; i++) {
                        var groupInputDetails = groupInputsExtra[answer[i].input_ref].data;
                        groupAnswers.push(
                            {
                                answer: $scope.parseAnswerForDb(answer[i].answer, groupInputDetails.type),
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