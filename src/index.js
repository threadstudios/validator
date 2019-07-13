import validator from 'validator';

validator.isRequired = (value) => {
    return (value && value !== "");
};

const basicLang = (check, field) => {
    switch(check) {
        case 'isRequired':
            return `${field} is required`;
        case 'isEmail':
            return `${field} must be a valid E-mail address`;
        default:
            return `${field} must be a valid ${check.replace('is', '').toLowerCase()}`;
    }
}

function runRules(rules, value, key) {
    const toValidate = rules.split('|')
    return toValidate.reduce((acc, rule) => {
        if (validator[rule]) {
            const ruleResult = validator[rule](value);
            if(!ruleResult && acc.isValid !== false) {
                acc.isValid = false;
                acc.errors.push(basicLang(rule, key));
            }
            return acc;
        } else {
            console.log("unable to find validate function");
        }
    }, { isValid : true, errors : [] });
}

export function isValid(config, values, lang = false) {
    let result = {
        fields : {},
        errorFields : [],
        errorMessages: [],
        isValid : null
    };
    for(let k in config) {
        let ruleResult;
        if(typeof config[k] === "string") {
            ruleResult = runRules(config[k], values[k], k);
        } else {
            console.log(typeof config, config);
        }
        result.fields[k] = ruleResult.isValid;
        if (ruleResult.isValid === false) {
            result.errorFields.push(k);
            result.errorMessages.push(...ruleResult.errors);
        }
    }
    result.isValid = Object.values(result.fields)
    .reduce((acc, field) => {
        if(field === false && acc === true) {
            acc = false;
        }
        return acc;
    }, true)
    return result;
}