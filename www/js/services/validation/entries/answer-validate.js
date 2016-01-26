/**
 * Answer Validate service
 */
angular.module('answer-validate', ['ionic'])
    .service('AnswerValidate', function () {

        this.errors = [];

        /**
         *
         * @param input_details
         * @param answer
         */
        this.validate = function (input_details, answer) {

            this.inputRef = input_details.ref;

            // if we have a required field, check not empty
            if (!this.checkRequired(input_details, answer)) {
                return false;
            }


            // type specific checks
            switch(input_details.type) {

                case 'group':

                    // do checks on all the answers within the group
                    //for () {
                    //    this.doAnswerChecks(input_details.type, answer, input_details.possible_answers, input_details.min, input_details.max, input_details.regex);
                    //}
                    
                    break;
                default:
                    // do checks on this answer and the input type
                    this.doAnswerChecks(input_details.type, answer, input_details.possible_answers, input_details.min, input_details.max, input_details.regex);
            }

        };

        /**
         *
         * @returns {Array}
         */
        this.getErrors = function () {
            return this.errors;
        };

        /**
         *
         * @returns {boolean}
         */
        this.hasErrors = function () {
            return Object.keys(this.errors).length > 0;
        };

        /**
         *
         */
        this.reset = function () {
            this.errors = [];
        };

        /* HELPER FUNCTIONS */

        /**
         * @param type
         * @param answer
         * @param possibleAnswers
         * @param min
         * @param max
         * @param regex
         */
        this.doAnswerChecks = function (type, answer, possibleAnswers, min, max, regex) {

            // Specific checks based on the input type
            switch (type) {

                case 'text':
                    this.checkRegex(regex, answer);
                    break;
                case 'integer':
                    this.checkInteger(answer, min, max);
                    break;
                case 'decimal':
                    this.checkDecimal(answer, min, max);
                    break;
                case 'date':
                    this.checkISO8601Date(answer);
                    break;
                case 'time':
                    this.checkISO8601Date(answer);
                    break;
                case 'dropdown':
                case 'radio':
                    this.checkSinglePossibleAnswers(possibleAnswers, answer);
                    break;
                case 'checkbox':
                    this.checkMultiplePossibleAnswers(possibleAnswers, answer);
                    break;
                case 'textarea':
                    this.checkRegex(regex, answer);
                    break;
                case 'location':
                    this.checkLocation(answer);
                    break;
                case 'photo':
                    this.checkFileFormat(answer, 'jpg');
                    break;
                case 'audio':
                case 'video':
                    this.checkFileFormat(answer, 'mp4');
                    break;
                case 'barcode':
                    // todo
                    break;
                case 'branch':
                    this.checkBranch(answer);
                    break;
                case 'group':
                    this.checkGroup(answer);
                    break;

            }

        };

        /**
         * Check whether answer is required and not empty
         *
         * @param input_details
         * @param answer
         * @return bool
         */
        this.checkRequired = function (input_details, answer) {
            if (input_details.is_required) {
                if (answer === '') {
                    this.errors[this.inputRef] = ['ec5_21'];
                    return false;
                }
            }
            return true;
        };

        /**
         * Check the regular expression
         *
         * @param regex
         * @param answer
         * @return bool
         */
        this.checkRegex = function (regex, answer) {
            // Check regex is met, if not empty
            if (answer !== '' && answer != null && regex !== '') {
                var re = new RegExp(regex);
                if (re.test(answer)) {
                    this.errors[this.inputRef] = ['ec5_23'];
                }
            }

        };

        /**
         * Check the date string is in ISO8601 format
         * if not empty
         *
         * @param answer
         */
        this.checkISO8601Date = function (answer) {
            // Check date string in answer against ISO8601 format
            //var re = new RegExp('^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}).(\\d+)(Z|((-|\\+)\\d{2}:\\d{2}))');
            //if (answer !== '' && !re.test(answer)) {
            //    this.errors[this.inputRef] = ['ec5_24'];
            //}
        };

        /**
         * Check possible answers for single selection inputs
         *
         * @param possibleAnswers
         * @param answer
         */
        this.checkSinglePossibleAnswers = function (possibleAnswers, answer) {
            //if (!empty(answer)) {
            //    if (count(possibleAnswers) > 0) {
            //        // Default match = false
            //        match = false;
            //        // Loop over each possible answer
            //        foreach (possibleAnswers as possibleAnswer) {
            //            // If we have a match, set match = true
            //            if (possibleAnswer['answer_id'] == answer) {
            //                match = true;
            //            }
            //        }
            //        // If we didn't match after looping possible answers
            //        // then we failed to find a match, so add error
            //        if (!match) {
            //            this.errors[this.inputRef] = ['ec5_25'];
            //        }
            //
            //    } else {
            //        // No possible answers available
            //        this.errors[this.inputRef] = ['ec5_26'];
            //    }
            //}
        };

        /**
         * Check possible answers for multiple selection inputs
         * looping through each comma separated answer
         *
         * @param possibleAnswers
         * @param answer
         */
        this.checkMultiplePossibleAnswers = function (possibleAnswers, answer) {
            //if (!empty(answer)) {
            //    // Explode answers on comma
            //    answers = explode(',', answer);
            //    if (count(answers) > 0) {
            //
            //        if (count(possibleAnswers) > 0) {
            //
            //            // Loop each given answer
            //            foreach (answers as a) {
            //
            //                // Default match = false
            //                match = false;
            //
            //                // Loop against each possible answer
            //                foreach (possibleAnswers as possibleAnswer) {
            //                    // if we have a match, set match = true
            //                    if (possibleAnswer['answer_id'] == a) {
            //                        match = true;
            //                    }
            //                }
            //                // If we didn't match after looping possible answers
            //                // then we failed to find a match, so add error
            //                if (!match) {
            //                    this.errors[this.inputRef] = ['ec5_25'];
            //                }
            //            }
            //
            //        } else {
            //            // No possible answers available
            //            this.errors[this.inputRef] = ['ec5_26'];
            //        }
            //    }
            //}
        };

        /**
         * Check an integer answer is valid
         *
         * @param answer
         * @param min
         * @param max
         */
        this.checkInteger = function (answer, min, max) {

            if (answer !== '' && answer != null) {
                console.log('the answer is: ' + answer);

                // Check the answer is an integer
                if (answer !== parseInt(answer, 10)) {
                    this.errors[this.inputRef] = ['ec5_27'];
                } else {
                    if (min != '') {
                        // Check answer is not less than the min
                        if (answer < min) {
                            this.errors[this.inputRef] = ['ec5_28'];
                        }
                    }

                    if (max != '') {
                        // Check answer is not greater than the max
                        if (answer > max) {
                            this.errors[this.inputRef] = ['ec5_28'];
                        }
                    }
                }
            }
        };

        /**
         * Check a decimal answer is valid
         *
         * @param answer
         * @param min
         * @param max
         */
        this.checkDecimal = function (answer, min, max) {

            if (answer !== '' && answer != null) {

                // Check the answer is a decimal or an integer
                if (answer !== parseFloat(answer)) {
                    this.errors[this.inputRef] = ['ec5_27'];
                } else {
                    if (min != '') {
                        // Check answer is not less than the min
                        if (answer < min) {
                            this.errors[this.inputRef] = ['ec5_28'];
                        }
                    }

                    if (max != '') {
                        // Check answer is not greater than the max
                        if (answer > max) {
                            this.errors[this.inputRef] = ['ec5_28'];
                        }
                    }
                }
            }
        };

        /**
         * Check there is no 'answer' for branches
         *
         * @param answer
         */
        this.checkBranch = function (answer) {
            if (answer !== '') {
                this.errors[this.inputRef] = ['ec5_29'];
            }
        };

        /**
         * Check the group answer is an array
         *
         * @param answer
         */
        this.checkGroup = function (answer) {
            //if (!is_array(answer)) {
            //    this.errors[this.inputRef] = ['ec5_29'];
            //}
        };

        /**
         * Check we have all the right parts for the location
         *
         * @param answer
         */
        this.checkLocation = function (answer) {
            //if (!empty(answer)) {
            //    locationArray = json_decode(answer, true);
            //
            //    // Check we have all the relevant keys in the array
            //    if (empty(locationArray['latitude']) || empty(locationArray['longitude']) || !isset(locationArray['accuracy'])) {
            //        this.errors[this.inputRef] = ['ec5_30'];
            //    }
            //}

        };

        /**
         * Function to check file name has required extension
         * @param answer
         * @param format
         */
        this.checkFileFormat = function (answer, format) {
            if (answer !== '') {
                var parts = answer.split('.');
                if (parts[1] !== format) {
                    this.errors[this.inputRef] = ['ec5_47'];
                }
            }

        };


    });