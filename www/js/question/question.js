angular.module('question', ['ionic', 'ngCordova'])

    .controller('QuestionCtrl', function($ionicPlatform, $scope, $stateParams, $state, $cordovaSQLite, $ionicHistory, WebService, ProjectModel, addEntry, DbService) {

        $scope.project = ProjectModel;
        $scope.addEntry = addEntry;
        $scope.formName = addEntry.formName;
        $scope.slug = $scope.project.getSlug();

        // retrieve input refs array
        var inputs = $scope.project.getFormInputs($scope.addEntry.currentFormRef);

        // retrieve current input ref from previous view
        $scope.currentInputRef = $stateParams.inputRef;
        $scope.currentInputIndex = $stateParams.inputIndex;


        // if we haven't been passed a current input ref, set
        if ($scope.currentInputRef == '') {

            // set default input index
            $scope.currentInputIndex = 0;
            // retrieve current input ref
            $scope.currentInputRef = inputs[$scope.currentInputIndex];
        }

        if ($scope.currentInputIndex < ($scope.addEntry.numInputsThisForm - 1)) {
            $scope.menuText = 'Next';
        } else {
            $scope.menuText = 'Save Entry';
        }

        if ($scope.currentInputIndex == 0) {
            $scope.prevText = 'Quit';
        } else {
            $scope.prevText = 'Previous';
        }

        // retrieve next input ref
        $scope.nextInputRef = inputs[$scope.currentInputIndex + 1];

        // retrieve the inputs extra details
        var inputsExtra = $scope.project.getExtraInputs();

        // retrieve the input details for this question
        $scope.inputDetails = inputsExtra[$scope.currentInputRef].data;

        // retrieve any possible answers for this question
        $scope.possibleAnswers = $scope.inputDetails.possible_answers;

        // retrieve any jumps for this question
        $scope.jumps = $scope.inputDetails.jumps;

        // get the question for this input
        $scope.question = $scope.inputDetails.question;

        // the input components for this question
        $scope.inputComponents = [];

        // retrieve the type of input
        $scope.type = $scope.inputDetails.type;

        // Set default answer object
        $scope.answer = {
            answer: '',
            was_jumped: false,
            input_ref: $scope.currentInputRef
        };

        /**
         * Validate and save answers
         * Go to next question/save entry (depending on where you are in the form)
         */
        $scope.next = function() {

            // access child answer here
            console.log($scope.answer);

            // reset validator errors
            //this.validator.reset();

            var wasJumped = false;

            // save answer
            var passed = $scope.saveAnswer($scope.currentInputRef, $scope.answer);

            // if answer passed validation and was successfully stored
            if (passed) {

                // NEXT QUESTION
                if ($scope.currentInputIndex < ($scope.addEntry.numInputsThisForm - 1)) {

                    // go to next question
                    $state.go('app.question', {
                        slug: $scope.slug,
                        formRef: $scope.addEntry.currentFormRef,
                        inputRef: $scope.nextInputRef,
                        inputIndex: Number($scope.currentInputIndex + 1)
                    });


                } else {
                    // SAVE ENTRY

                    DbService.getAnswers($scope.addEntry.entryUuid).then(function() {

                        var slug = $scope.slug;

                        var entry = $scope.addEntry.makeJsonEntry($scope.addEntry.answers);
                        DbService.saveEntry(slug, $scope.addEntry.entryUuid, entry).then(function() {
                            console.log(entry);
                            alert('Entry added!');

                            // once the entry has inserted, take to entry screen, disabling back view
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.entries', {slug: slug});
                        });


                    });
                }
            }

        };

        /**
         * Go to previous page
         */
        $scope.previous = function() {

            var back = true;

            // if we are at the start of the entry, alert user
            if ($scope.currentInputIndex === 0) {
                back = confirm('Are you sure you want to quit this entry?');
            }

            if (back) {
                $ionicHistory.goBack()
            }

        };

        /**
         * Validate and save answers
         *
         * @param wasJumped
         * @return boolean
         */
        $scope.saveAnswer = function(wasJumped) {

            var answer = '';

            // check whether answer is valid
            //if (this.validator.hasErrors()) {
            //    var errors = this.validator.getErrors();
            //    for (var error in errors) {
            //        if (errors.hasOwnProperty(error)) {
            //            alert('Error: ' + this.statusCodes.getMessage(errors[error]));
            //        }
            //    }
            //    return false;
            //}

            // Do some cleansing on the answer, relative to its question type
            switch ($scope.type) {

                case 'checkbox':
                    // join checkbox answers into csv
                    var tempAnswer = [];
                    for (var i in $scope.answer.answer) {
                        if ($scope.answer.answer[i] == true) {
                            tempAnswer.push(i);
                        }
                    }
                    $scope.answer.answer = tempAnswer.join(',');

                    break;



            }
            console.log(answer);
            // store the answer
            DbService.saveAnswer($scope.addEntry.entryUuid, $scope.currentInputRef, $scope.answer);
            // success
            return true;

        };

        /**
         * Get answer for this question
         */
        $scope.getAnswer = function() {

            // Check the database for any stored answer for this question
            DbService.getAnswer($scope.addEntry.entryUuid, $scope.currentInputRef).then(function(res) {

                if (res) {

                    var answer = JSON.parse(res.rows.item(0).answer);
                    // Do some cleansing on the answer, relative to its question type
                    switch ($scope.type) {

                        case 'checkbox':
                            // split checkbox answers into array
                            var answerArray = answer.answer.split(',');
                            answer.answer = {};
                            for (var i = 0; i < answerArray.length; i++) {
                                answer.answer[answerArray[i]] = true;
                            }

                            break;

                        //case 'group':
                        //
                        //    break;

                    }

                    $scope.answer = answer;
                    console.log($scope.answer);
                }


            });




        };

        /**
         * Take a picture
         */
        $scope.takePicture = function() {

            var cameraOptions =   {   quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,      // 0:Photo Library, 1=Camera, 2=Saved Album
                encodingType: 0,     // 0=JPG 1=PNG
                correctOrientation: true
            };

            navigator.camera.getPicture(function(imageURI) {

                var base64Image = "data:image/jpeg;base64," + imageURI;
                // imageURI is the URL of the image that we can use for
                // an <img> element or backgroundImage.
                $scope.answer.answer = base64Image;


            }, function(err) {

                // Uh-roh, something bad happened

            }, cameraOptions);
        };


        // Check if we already have an answer stored for this question
        $ionicPlatform.ready(function () {
            $scope.getAnswer();
        });

    })

    /**
     * Child directive - question and input depending on 'type'
     */
    .directive("child", function($compile){

    var getTemplate = function(scope, type, question, answer, possibleAnswers) {

        var template = '';

        switch(type) {

            case 'decimal':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="number" step="0.01" ng-model="' + answer + '"></label><br />';
                break;
            case 'integer':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="number" ng-model="' + answer + '"></label><br />';
                break;
            case 'date':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="date" ng-model="' + answer + '"></label><br />';
                break;
            case 'textarea':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><textarea rows="10" ng-model="' + answer + '"></textarea></label><br />';
                break;
            case 'radio':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                for (var i = 0; i < possibleAnswers.length; i++) {
                    template += '<ion-radio ng-model="answer.answer" ng-value="' + possibleAnswers[i].answer_id + '">'+ possibleAnswers[i].answer +'</ion-radio>';
                }
                template += '</div><br />';
                break;
            case 'dropdown':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                for (var i = 0; i < possibleAnswers.length; i++) {
                    template += '<ion-radio ng-model="answer.answer" ng-value="' + possibleAnswers[i].answer_id + '">'+ possibleAnswers[i].answer +'</ion-radio>';
                }
                template += '</div><br />';
                break;
            case 'checkbox':
                template = '<label class="item item-input item-stacked-label item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                for (var i = 0; i < possibleAnswers.length; i++) {
                    template += '<ion-checkbox ng-model="answer.answer[' + possibleAnswers[i].answer_id + ']" ng-value="' + possibleAnswers[i].answer_id + '" value="' + possibleAnswers[i].answer_id + '">'+ possibleAnswers[i].answer +'</ion-checkbox>'
                }
                template += '</div><br />';
                break;
            case 'photo':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal" ng-click="takePicture();">Take Picture</button></label>'+
                            '<img src="{{ answer.answer }}"/><br />';
                break;
            case 'branch':
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal">Add Branch</button></label><br />';
                break;
            case 'group':

                template = '';

                var group = scope.project.getGroupInputs(scope.addEntry.currentFormRef, scope.inputDetails.ref);

                scope.answer.answer = {};

                for (var i = 0; i < group.length; i++) {

                    var groupInputsExtra = scope.project.getExtraInputs();
                    var groupInputDetails = groupInputsExtra[group[i].ref].data;

                    scope.answer.answer[groupInputDetails.ref] = {
                        input_ref: groupInputDetails.ref,
                        was_jumped: false,
                        answer: ''
                    };

                    template += getTemplate(scope, groupInputDetails.type, groupInputDetails.question, 'answer.answer.' + groupInputDetails.ref + '.answer', groupInputDetails.possible_answers);

                }

                break;
            default:
                template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="text" ng-model="' + answer + '"></label><br />';
        }

        return template;
    };

    return {
        restrict: "E",
        link: function(scope, element, attrs, QuestionCtrl) {

            element.html(getTemplate(scope, scope.$parent.type, scope.$parent.question, 'answer.answer', scope.$parent.possibleAnswers));

            $compile(element.contents())(scope);


        }
    }
});
