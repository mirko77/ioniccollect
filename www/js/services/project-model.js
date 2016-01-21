/**
 * Project Model service
 */
angular.module('project-model', ['ionic'])
    .service('ProjectModel', function () {

    this.json_structure = {};
    this.extra_structure = {};


    this.initialise = function (data, extra) {
        this.json_structure = JSON.parse(data);
        this.extra_structure = JSON.parse(extra);
    };

    this.getProjectName = function () {
        return this.extra_structure.project.details.name;
    };

    this.getSlug = function () {
        return this.extra_structure.project.details.slug;
    };

    this.getForms = function () {
        return (this.json_structure.project.forms) ? this.json_structure.project.forms : {};
    };

    this.getInputs = function (formRef) {
        return (this.extra_structure.forms[formRef].inputs) ? this.extra_structure.forms[formRef].inputs : {};
    };

    this.getInputsExtra = function () {
        return (this.extra_structure.inputs) ? this.extra_structure.inputs : {};
    };

    this.getExtraStructure = function () {
        return (this.extra_structure) ? this.extra_structure : {};
    };

    this.getJsonStructure = function () {
        return (this.json_structure) ? this.json_structure : {};
    };

    // FORMS
    this.getJsonForms = function () {
        return (this.json_structure.project.forms) ? this.json_structure.project.forms : {};
    };

    this.getExtraForms = function () {
        return (this.extra_structure.forms) ? this.extra_structure.forms : {};
    };

    this.getFirstFormRef = function () {
        return (this.extra_structure.project.forms[0]) ? this.extra_structure.project.forms[0] : {};
    };

    this.getFirstForm = function () {
        return this.extra_structure.forms[this.getFirstFormRef()];
    };

    this.addFormToExtra = function (ref, data) {

        var details = 'branch_entry';
        this.extra_structure.forms[ref] = {details: details, inputs: [], cntinputs: 0};
    };

    this.getExtraInputs = function () {
        return (this.extra_structure.inputs) ? this.extra_structure.inputs : {};
    };

    this.getFormInputs = function (formRef) {
        return (this.extra_structure.forms[formRef].inputs) ? this.extra_structure.forms[formRef].inputs : {};
    };

    this.getInput = function (inputRef) {
        return (this.extra_structure.inputs[inputRef]) ? this.extra_structure.inputs[inputRef] : {};
    };

    // BRANCHES
    this.getFormBranches = function (formRef) {
        return (this.extra_structure.forms[formRef].branch) ? this.extra_structure.forms[formRef].branch : {};
    };

    // GROUPS
    this.getFormGroups = function (formRef) {
        return (this.extra_structure.forms[formRef].group) ? this.extra_structure.forms[formRef].group : {};
    };

    this.getGroupInputs = function (formRef, inputRef) {

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

});