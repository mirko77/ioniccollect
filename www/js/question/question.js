angular.module('question', ['ionic', 'ngCordova', 'status-codes', 'answer-validate'])

    .controller('QuestionCtrl', function ($ionicPlatform, $scope, $stateParams, $state, $cordovaSQLite, $ionicHistory, WebService, ProjectModel, EntryService, DbService, StatusCodes, AnswerValidate, AnswerService) {

        $scope.project = ProjectModel;
        $scope.EntryService = EntryService;
        $scope.formName = $scope.EntryService.formName;
        $scope.projectRef = $scope.project.getProjectRef();
        $scope.validator = AnswerValidate;

        // retrieve input refs array
        var inputs = $scope.project.getFormInputs($scope.EntryService.currentFormRef);

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

        if ($scope.currentInputIndex < ($scope.EntryService.numInputsThisForm - 1)) {
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
        $scope.inputsExtra = $scope.project.getExtraInputs();

        // retrieve the input details for this question
        $scope.inputDetails = $scope.inputsExtra[$scope.currentInputRef].data;

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

        $scope.jumps = $scope.inputDetails.jumps;

        $scope.answer = {
            answer: '',
            was_jumped: false,
            input_ref: $scope.currentInputRef
        };

        /**
         * Validate and save answers
         * Go to next question/save entry (depending on where you are in the form)
         */
        $scope.next = function () {

            var wasJumped = false;

            // Check if we are jumping to another question
            if ($scope.jumps.length > 0) {
                // process the jumps to set the correct next input ref value
                $scope.processJumps();
            }

            // validate and save answer
            var passed = AnswerService.saveAnswer($scope.answer.answer, $scope.inputDetails, wasJumped);

            // if answer passed validation and was successfully stored
            if (passed) {

                // NEXT QUESTION
                if ($scope.currentInputIndex < ($scope.EntryService.numInputsThisForm - 1)) {

                    // go to next question
                    $state.go('app.question', {
                        project_ref: $scope.projectRef,
                        formRef: $scope.EntryService.currentFormRef,
                        inputRef: $scope.nextInputRef,
                        inputIndex: Number($scope.currentInputIndex + 1)
                    });


                } else {
                    // SAVE ENTRY
                    $scope.EntryService.saveEntry($scope.projectRef).then(function() {
                        // once the entry has inserted, navigate to entry screen, disabling back view
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.entries', {project_ref: $scope.projectRef});
                    });

                }
            }

        };

        /**
         * Go to previous page
         */
        $scope.previous = function () {

            var back = true;

            // if we are at the start of the entry, alert user
            if ($scope.currentInputIndex === 0) {
                back = confirm(StatusCodes.getMessage('ec5_78'));
            }

            if (back) {
                $ionicHistory.goBack()
            }

        };

        /**
         * Process jumps for this question
         * Setting the next input ref based on the conditions
         */
        $scope.processJumps = function () {

            for (var i = 0; i < $scope.jumps.length; i++) {

                var currentJump = $scope.jumps[i];

                switch (currentJump.when) {

                    case 'IS':

                        $scope.nextInputRef = currentJump.to;
                        break;

                    case 'IS_NOT':

                        $scope.nextInputRef = currentJump.to;
                        break;

                    case 'NO_ANSWER_GIVEN':

                        break;

                    case 'ALL':

                        break;
                }

            }

            //"jumps": [
            //    {
            //        "to": "ec5_test_5",
            //        "when": "IS",
            //        "answer_ref": 1
            //    },
            //    {
            //        "to": "END",
            //        "when": "IS",
            //        "answer_ref": 2
            //    }
            //],

        };

        /**
         * Take a picture
         */
        $scope.takePicture = function () {

            var cameraOptions = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,      // 0:Photo Library, 1=Camera, 2=Saved Album
                encodingType: 0,     // 0=JPG 1=PNG
                correctOrientation: true
            };

            navigator.camera.getPicture(function (imageURI) {

                var base64Image = "data:image/jpeg;base64," + imageURI;
                // imageURI is the URL of the image that we can use for
                // an <img> element or backgroundImage.
                $scope.answer.answer = base64Image;


            }, function (err) {

                // Uh-roh, something bad happened

            }, cameraOptions);
        };


        $ionicPlatform.ready(function () {
            // Check if we already have an answer stored for this question
            $scope.answer = AnswerService.getAnswer($scope.inputDetails);
            console.log($scope.answer);

        });

    })

    /**
     * Child directive - question and input depending on 'type'
     */
    .directive("child", function ($compile) {

        /**
         * Add child input templates to the main question pages
         * For data binding, we add a string variable, bindingString, which
         * will bind to the class 'answer' object, as 'answer.answer', or for groups
         * 'answer.answer[i].answer', as each group input answer is contained within the group
         * 'answer.answer' array
         *
         * @param scope
         * @param type
         * @param question
         * @param bindingString - the string assigned to the ng-model for the answer
         * @param possibleAnswers
         * @returns {string}
         */
        var getTemplate = function (scope, type, question, bindingString, possibleAnswers) {

            var template = '';

            switch (type) {

                case 'decimal':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="number" step="0.01" ng-model="' + bindingString + '"></label><br />';
                    break;
                case 'integer':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="number" ng-model="' + bindingString + '"></label><br />';
                    break;
                case 'date':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="date" ng-model="' + bindingString + '"></label><br />';
                    break;
                case 'time':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="time" ng-model="' + bindingString + '"></label><br />';
                    break;
                case 'textarea':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><textarea rows="10" ng-model="' + bindingString + '"></textarea></label><br />';
                    break;
                case 'radio':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                    for (var i = 0; i < possibleAnswers.length; i++) {
                        template += '<ion-radio ng-model="' + bindingString + '" value="' + possibleAnswers[i].answer_ref + '">' + possibleAnswers[i].answer + '</ion-radio>';
                    }
                    template += '</div><br />';
                    break;
                case 'dropdown':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                    for (var i = 0; i < possibleAnswers.length; i++) {
                        template += '<ion-radio ng-model="' + bindingString + '" value="' + possibleAnswers[i].answer_ref + '">' + possibleAnswers[i].answer + '</ion-radio>';
                    }
                    template += '</div><br />';
                    break;
                case 'checkbox':
                    template = '<label class="item item-input item-stacked-label item-stacked-label"><span class="input-label">' + question + '</span></label><div class="list">';
                    for (var i = 0; i < possibleAnswers.length; i++) {
                        template += '<ion-checkbox ng-model="' + bindingString + '[\'' + possibleAnswers[i].answer_ref + '\']" value="' + possibleAnswers[i].answer_ref + '">' + possibleAnswers[i].answer + '</ion-checkbox>'
                    }
                    template += '</div><br />';
                    break;
                case 'photo':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal" ng-click="takePicture();">Take Picture</button></label>' +
                        '<img src="{{ ' + bindingString + ' }}"/><br />';
                    break;
                case 'barcode':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal" ng-click="takePicture();">Scan Barcode</button></label>' +
                        '<img src="{{ ' + bindingString + ' }}"/><br />';
                    break;
                case 'video':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal" ng-click="takePicture();">Record Video</button></label>' +
                        '<img src="{{ ' + bindingString + ' }}"/><br />';
                    break;
                case 'audio':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal" ng-click="takePicture();">Record Audio</button></label>' +
                        '<img src="{{ ' + bindingString + ' }}"/><br />';
                    break;
                case 'branch':
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><button class="button button-royal">Add Branch</button></label><br />';
                    break;
                case 'group':

                    template = '';

                    var group = scope.project.getGroupInputs(scope.EntryService.currentFormRef, scope.inputDetails.ref);

                    scope.answer.answer = [];

                    for (var i = 0; i < group.length; i++) {

                        var groupInputDetails = scope.inputsExtra[group[i].ref].data;

                        // push group input answer into main group answer array
                        scope.answer.answer.push({
                            input_ref: groupInputDetails.ref,
                            was_jumped: false,
                            answer: ''
                        });

                        template += getTemplate(scope, groupInputDetails.type, groupInputDetails.question, 'answer.answer[' + i + '].answer', groupInputDetails.possible_answers);

                    }

                    break;
                default:
                    template = '<label class="item item-input item-stacked-label"><span class="input-label">' + question + '</span><input type="text" ng-model="' + bindingString + '"></label><br />';
            }

            return template;
        };

        return {
            restrict: "E",
            link: function (scope, element, attrs, QuestionCtrl) {

                element.html(getTemplate(scope, scope.$parent.type, scope.$parent.question, 'answer.answer', scope.$parent.possibleAnswers));

                $compile(element.contents())(scope);


            }
        }
    });
