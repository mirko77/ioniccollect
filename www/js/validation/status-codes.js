import {Injectable} from 'angular2/core';

@Injectable()
export class StatusCodes {
    constructor() {

        this.codes = {
            'ec5_11': 'Project does not exist.',
            'ec5_12': 'User could not be authenticated.',
            'ec5_13': 'User not authorised to view project.',
            'ec5_14': 'No data attribute found in json structure.',
            'ec5_15': 'Form does not exist.',
            'ec5_16': 'Special input does not exist.',
            'ec5_17': 'A required owner entry for this branch does not exist.',
            'ec5_18': 'A required parent form does not exist.',
            'ec5_19': 'A required parent form entry does not exist.',
            'ec5_20': 'JSON missing attribute.',
            'ec5_21': 'Required field is missing.',
            'ec5_22': 'Field is not unique.',
            'ec5_23': 'Regex format not matched.',
            'ec5_24': 'Date format not matched.',
            'ec5_25': 'Possible answer not matched.',
            'ec5_26': 'Possible answers not found.',
            'ec5_27': 'Number format incorrect.',
            'ec5_28': 'Value outside range.',
            'ec5_29': 'Value invalid.',
            'ec5_30': 'Location data not valid.',
            'ec5_31': 'Google+ user could not be authenticated. Please contact the server administrator.',
            'ec5_32': 'Google+ user could not be authenticated.',
            'ec5_33': 'LDAP user could not be authenticated.',
            'ec5_34': 'User not found.',
            'ec5_35': 'New User added.',
            'ec5_36': 'User Password/Email incorrect.',
            'ec5_37': 'Too many failed login attempts made. Please try again in 1 minute.',
            'ec5_38': 'No Provider Key available.',
            'ec5_39': 'Validation failed.',
            'ec5_40': 'The passwords do not match.',
            'ec5_41': 'The email address must be unique.',
            'ec5_42': 'The email address is not correct.',
            'ec5_43': 'The minimum value has not been met.',
            'ec5_44': 'The maximum value has been exceeded.',
            'ec5_45': 'Data could not be inserted into the database.',
            'ec5_46': 'A required owner entry for this group does not exist.',
            'ec5_47': 'File format incorrect.',
            'ec5_60': 'No File Uploaded.',
            'ec5_61': 'invalid JSON structure.',
            'ec5_62': 'invalid input type.'


        }

    }

    /**
     * Get the message for the supplied code
     *
     * @param code
     * @returns {*}
     */
    getMessage(code) {
        return this.codes[code];
    }

}