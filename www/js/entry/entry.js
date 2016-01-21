import {IonicApp} from 'ionic/ionic';
import {Project} from '../project/project';
import {EntryHelper} from '../entry/entry-helper';
import {Injectable} from 'angular2/core';
import {DataEntries} from '../data/data-entries';


@Injectable()
export class Entry {
    constructor(project: Project, entryHelper: EntryHelper, dataEntries: DataEntries) {
        this.project = project;
        this.dataEntries = dataEntries;
        this.entryUuid = this.uuid();
        this.forms = [];
        this.formName = '';
        this.numForms = 0;
        this.currentFormIndex = 0;
        this.numInputsThisForm = 0;
        this.inputs = {};
        this.answers = {};
        this.setUp();
        console.log(this.entryUuid);
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
     * Function to save a complete entry
     */
    saveEntry(answers) {

        // Generate entry json
        entryJson = this.makeJsonEntry(answers);
        // Store entry
        this.dataEntries.saveEntry(this.project, this.entryUuid, entryJson);

        //console.log(entryJson);

    }

    /**
     *
     * @param answers
     * @returns {{data: {type: string, id: (string|*), entry_uuid: (string|*), attributes: {form: {ref: (string|*), type: string}}, relationships: {parent: {}, branch: {}}, created_at: string, device_id: string, jwt: null}}}
     */
    makeJsonEntry(answers) {

        var entry_type = 'entry';
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

        entryJson.data[entry_type] = answers;

        return entryJson;

    };

    /**
     * Helper method to create a uuid
     *
     * @returns {string}
     */
    uuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}
