import {IonicApp} from 'ionic/ionic';
import {Project} from '../project/project';
import {EntryHelper} from '../entry/entry-helper';
import {Injectable} from 'angular2/core';

@Injectable()
export class BranchEntry {
    constructor(project: Project, entryHelper: EntryHelper) {
        this.project = project;
        //this.entryHelper = entryHelper;
        //if (typeof this.currentInputIndex === 'undefined') {
        //    this.forms = [];
        //    this.currentFormRef = '';
        //    this.currentInputRef = '';
        //    this.currentFormIndex = 0;
        //    this.numInputsThisForm = 0;

        this.entryUuid = entryHelper.uuid();
        this.forms = [];
        this.formName = '';
        this.numForms = 0;
        this.currentFormIndex = 0;
        this.numInputsThisForm = 0;
        this.inputs = {};
        //}

        this.answers = {};
        this.setUp();
    }

    /**
     * Initial function to set up the entry
     */
    setUp() {

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
                if (i === 0) {
                    this.formName = forms[form].details.name;
                    this.currentFormRef = form;
                    this.currentFormIndex = form;
                    this.inputs = this.project.getFormInputs(form);
                    this.numInputsThisForm = this.inputs.length;
                }

                i++;
            }


        }

        //// Add the inputs markup
        //this.addInputs(inputs);
        //this.show();

    }


    /**
     * Show function
     */
    show() {

        var owner_out_element = document.getElementById(this.owner_out_div);
        owner_out_element.innerHTML = '';
        // create outer div element
        var out_element = document.createElement('div');
        out_element.setAttribute('class', 'add-entry-container');
        out_element.setAttribute('id', this.entry_uuid);

        // set progress bar
        var percentage = Math.round(((this.currentInputIndex + 1) / this.numInputsThisForm) * 100);
        out_element.appendChild(this.helper.progressBar(percentage, this.entry_uuid));

        // add prev/next buttons
        out_element.appendChild(this.helper.addNextPrevButtons(this.previous_input_index));
        // add submit button
        this.out_panel.appendChild(this.helper.createSubmitButton());
        out_element.appendChild(this.out_panel);

        // add div element to  element
        owner_out_element.appendChild(out_element);

        // update progress
        this.helper.updateProgress(percentage, this.entry_uuid);

    }

;

    /**
     * Function to add the inputs markup
     */
    addInputs(inputs) {

        this.out_panel = this.helper.createDivPanel(this.entry_uuid, 'First Form');

        var inputs_extra = this.project.getExtraInputs();
        var hide;

        for (var i = 0; i < inputs.length; i++) {

            var input_ref = inputs[i];
            var input_details = inputs_extra[input_ref].data;
            var input_type = input_details.type;
            var ele;
            hide = false;
            if (this.current_input_ref === '') {
                this.current_input_ref = input_ref;
            }
            if (i > 0) {
                hide = true;
            }

            switch (input_type) {

                // add all group inputs markup in one go
                case 'group':

                    var group = this.project.getGroupInputs(this.currentFormRef, input_details.ref);

                    ele = this.helper.addGroupInputs(input_details.ref, group, i, hide, this.entry_uuid);

                    break;

                default:
                    // add all other inputs markup as normal
                    ele = this.helper.createInput(input_details, i, hide, this.entry_uuid, true);
            }

            // add input to panel
            this.out_panel.appendChild(ele);
            // add default answer to answers array
            this.answers[this.current_input_ref] = entry_helper.getDefaultAnswer(this.currentFormRef, input_ref);
        }

    }

;

    /**
     * Function to handle moving to next/previous questions
     *
     * @param number
     * @returns {boolean}
     */
    toggleQuestion(number) {

        var inputs = this.project.getFormInputs(this.currentFormRef);

        // reset validator errors
        validator.reset();

        // validate and add answer to answers array
        this.answers[this.current_input_ref] = entry_helper.getAnswer(this.entry_uuid, this.currentFormRef, this.current_input_ref, false);

        if (validator.hasErrors()) {
            var errors = validator.getErrors();
            for (var error in errors) {
                if (errors.hasOwnProperty(error)) {
                    alert('Error: ' + errors[error]);
                }

            }

            return false;
        }

        // hide current input
        this.helper.hide(this.entry_uuid + '-' + this.currentInputIndex);

        // increment/decrement input index
        this.currentInputIndex = this.currentInputIndex + number;

        // update current input ref
        this.current_input_ref = inputs[this.currentInputIndex];

        this.helper.updateProgress(Math.round(((this.currentInputIndex + 1) / this.numInputsThisForm) * 100), this.entry_uuid);

        // update buttons
        this.updateButtons();

        // show next input
        this.helper.show(this.entry_uuid + '-' + this.currentInputIndex);

    }

;

    /**
     * Function to add branches to this entry
     *
     * @param branch_entry
     */
    addBranch(branch_entry) {
        this.branches.push(branch_entry);
    }

;

    /**
     * Finalise entry, adding last answer
     * and validating
     *
     * @returns {boolean}
     */
    finalise() {

        validator.reset();

        // validate and add answer to answers array
        this.answers[this.current_input_ref] = entry_helper.getAnswer(this.entry_uuid, this.currentFormRef, this.current_input_ref, false);

        if (validator.hasErrors()) {
            alert('error!');
            return false;
        }

        return true;
    }

;

    /**
     * Enabling and disabling buttons
     */
    updateButtons() {

        // beginning of form
        if (this.currentInputIndex < 1) {
            $('.prev-button').prop('disabled', true);
        } else {
            $('.prev-button').prop('disabled', false);
        }

        // end of form
        if (this.currentInputIndex === this.numInputsThisForm - 1) {
            $('.next-button').prop('disabled', true);
            // enable submit button
            this.helper.show('submit-entry');
        } else {
            $('.next-button').prop('disabled', false);
            this.helper.hide('submit-entry');
        }
    }


}
