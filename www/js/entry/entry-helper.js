import {AnswerValidate} from '../validation/entries/answer-validate';
import {Project} from '../project/project';
import {Injectable} from 'angular2/core';

@Injectable()
export class EntryHelper {
    constructor(project: Project, validator: AnswerValidate) {
        this.project = project;
        this.validator = validator;
    }

    /**
     * Validate and create answers
     *
     * @param entry_uuid
     * @param form_ref
     * @param input_ref
     * @param answer
     * @param was_jumped
     */
    getAnswer(entry_uuid, form_ref, input_ref, answer, was_jumped) {

        var inputs_extra = this.project.getExtraInputs();
        var input_details = inputs_extra[input_ref].data;
        var element;
        var index;
        var possible_answers;

        switch (input_details.type) {

            case 'radio':

                possible_answers = input_details.possible_answers;
                for (index in possible_answers) {

                    if (possible_answers.hasOwnProperty(index)) {
                        //element = $('#' + entry_uuid + '-' + input_details.ref + '_' + input_details.possible_answers[index].answer_id);
                        //if (element.is(':checked')) {
                        //
                        //    // validate this answer
                        //    this.validator.validate(input_details, input_details.possible_answers[index].answer_id);
                        //
                        //    // if validation passes
                        //    if (!this.validator.hasErrors()) {
                        //        return this.generateAnswer(input_details.possible_answers[index].answer_id, input_details.ref, was_jumped);
                        //    }
                        //
                        //}
                    }
                }

                return this.generateAnswer('', input_details.ref, was_jumped);

            case 'checkbox':

                var answers = [];
                possible_answers = input_details.possible_answers;

                for (index in possible_answers) {
                    if (possible_answers.hasOwnProperty(index)) {
                        //element = $('#' + entry_uuid + '-' + input_details.ref + '_' + input_details.possible_answers[index].answer_id);
                        //if (element.is(':checked')) {
                        //
                        //    // validate this answer
                        //    this.validator.validate(input_details, input_details.possible_answers[index].answer_id);
                        //
                        //    // if validation passes
                        //    if (!this.validator.hasErrors()) {
                        //        answers.push(input_details.possible_answers[index].answer_id);
                        //    }
                        //
                        //}
                    }
                }

                // if validation passes
                if (!this.validator.hasErrors()) {
                    return this.generateAnswer(answers.join(), input_details.ref, was_jumped);
                }

                break;

            case 'branch':

                // add empty answer for top level input
                return this.generateAnswer('', input_details.ref, was_jumped);

            case 'group':

                var group = this.project.getGroupInputs(form_ref, input_details.ref);

                var group_answers = {};

                for (index in group) {
                    if (group.hasOwnProperty(index)) {

                        group_answers[index] = this.getAnswer(entry_uuid, form_ref, index, '', false);

                    }
                }

                return this.generateAnswer(group_answers, input_details.ref, was_jumped);

            default:

                // validate this answer
                this.validator.validate(input_details, answer);

                // if validation passes
                if (!this.validator.hasErrors()) {
                    return this.generateAnswer(answer, input_details.ref, was_jumped);

                }

        }

    }

    /**
     * Generate answer object
     *
     * @param answer
     * @param ref
     * @param was_jumped
     * @returns {{answer: *, was_jumped: *, input_ref: *}}
     */
    generateAnswer(answer, ref, was_jumped) {

        return {
            answer: answer,
            was_jumped: was_jumped,
            input_ref: ref
        }

    }


}
