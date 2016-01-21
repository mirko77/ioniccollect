
export class Project {
    constructor() {
        this.json_structure = {};
        this.extra_structure = {};
    }

    initialise(data, extra) {
        this.json_structure = JSON.parse(data);
        this.extra_structure = JSON.parse(extra);
    }

    getForms() {
        return (this.json_structure.project.forms) ? this.json_structure.project.forms : {};
    }

    getInputs(formRef) {
        return (this.extra_structure.forms[formRef].inputs) ? this.extra_structure.forms[formRef].inputs : {};
    }

    getInputsExtra() {
        return (this.extra_structure.inputs) ? this.extra_structure.inputs : {};
    }

    getExtraStructure() {
        return (this.extra_structure) ? this.extra_structure : {};
    }


    getJsonStructure() {
        return (this.json_structure) ? this.json_structure : {};
    }

    // FORMS
    getJsonForms() {
        return (this.json_structure.project.forms) ? this.json_structure.project.forms : {};
    }

    getExtraForms() {
        return (this.extra_structure.forms) ? this.extra_structure.forms : {};
    }

    getFirstFormRef() {
        return (this.extra_structure.project.forms[0]) ? this.extra_structure.project.forms[0] : {};
    }

    getFirstForm() {
        return this.extra_structure.forms[this.getFirstFormRef()];
    }

    addFormToExtra(ref, data) {

        var details = 'branch_entry';
        this.extra_structure.forms[ref] = {details: details, inputs: [], cntinputs: 0};
    }


    getExtraInputs() {
        return (this.extra_structure.inputs) ? this.extra_structure.inputs : {};
    }

    getFormInputs(formRef) {
        return (this.extra_structure.forms[formRef].inputs) ? this.extra_structure.forms[formRef].inputs : {};
    };

    getInput(inputRef) {
        return (this.extra_structure.inputs[inputRef]) ? this.extra_structure.inputs[inputRef] : {};
    };

    // BRANCHES
    getFormBranches(formRef) {
        return (this.extra_structure.forms[formRef].branch) ? this.extra_structure.forms[formRef].branch : {};
    }

    // GROUPS
    getFormGroups = function (formRef) {
        return (this.extra_structure.forms[formRef].group) ? this.extra_structure.forms[formRef].group : {};
    }

    getGroupInputs(formRef, inputRef) {

        var out = [];

        if (this.extra_structure.forms[formRef].group[inputRef]) {
            var group = this.extra_structure.forms[formRef].group[inputRef];
            // loop group input refs and retrieve inputs
            for (var i = 0; i < group.length; i++) {
                var input = this.getInput(group[i]).data;
                out[i] = input;
            }
        }

        return out;
    }

}