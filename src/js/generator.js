var ruleList = {
    "template": undefined,
    "container": undefined,
    "outputFile": null,
    "rules": {}
};

/**
 * disabled_rules
 *   - colon
 * opt_in_rules
 *   - empty_count
 */

/**
 * Handlebars helper you can call from your template files to
 * return syntax highlighted swift code.
 */
Handlebars.registerHelper("syntax", function(code) {
    var syntax = new Syntax({
        language: "swift",
        cssPrefix: ""
    });
    syntax.richtext(code);

    return syntax.html();
});

/**
 * Get a list of all available rule files and populate the rule
 * list with them.
 */
function populateRulesList() {
    $.get('data/rules.json', function (data) {
        data.forEach(function (ruleFile) {
            var rulePlaceholderName = ruleFile.replace(".", "_");
            ruleList.container.append("<div id='"+rulePlaceholderName+"'></div>");
            populateRule(ruleFile, rulePlaceholderName);
        });
    });
}

/**
 * Populate a single rule template with information.
 * Because of asynchronous data loading we need a placeholder div for the correct rule order.
 */
function populateRule(ruleFile, rulePlaceholderName) {
    $.get('data/rules/' + ruleFile, function (data) {
        var ruleHtml = $(ruleList.template(data));
        var rulePlaceholder = $('#' + rulePlaceholderName);
        rulePlaceholder.replaceWith(ruleHtml);
        ruleList.rules[data.identifier] = data;
    });
}

function generateFile(content) {
    var data = new Blob([content], {type: 'application/x-yaml'});

    if (ruleList.outputFile !== null) {
        window.URL.revokeObjectURL(ruleList.outputFile);
    }

    ruleList.outputFile = window.URL.createObjectURL(data);

    return ruleList.outputFile;
}

/**
 * Main entry point.
 */
function main() {
    $.get('views/rule.hbs', function (data) {
        ruleList.template = Handlebars.compile(data, {
            "noEscape": true
        });
        ruleList.container = $('#container');

        populateRulesList();
    });
}

function createOptInRule(key, enabled) {
    if (enabled) {
        return '  - ' + key + '\n';
    }

    return '';
}

function createOptOutRule(key, enabled) {
    if (!enabled) {
        return '  - ' + key + '\n';
    }

    return '';
}

function createConfigurationForRule(rule, enabled) {
    if (!enabled) {
        return '';
    }

    if (!rule.configuration) {
        return '';
    }

    var configuration = rule.identifier + ':\n';

    for (key in rule.configuration) {
        var value = $('#' + rule.identifier + '__' + rule.configuration[key].name).val();
        console.log('#' + rule.identifier + '__' + rule.configuration[key].name);
        configuration += '  ' + rule.configuration[key].name + ': ' + value + '\n';
    }

    return configuration + '\n';
}

$('#swiftlint-config').submit(function () {
    console.log('test' + ruleList.rules);

    var optInRules = '';
    var optOutRules = '';
    var configuration = '';

    for (var key in ruleList.rules) {
        var rule = ruleList.rules[key];

        var enabled = $('#container').find('#' + key).is(':checked');

        if (rule.opt_in) {
            optInRules += createOptInRule(key, enabled);
        }
        else {
            optOutRules += createOptOutRule(key, enabled);
        }

        configuration += createConfigurationForRule(rule, enabled);
        if (typeof ga === 'function') {
            ga('send', 'event', '' + key, '' + enabled);
        }
    }

    if (optOutRules !== '') {
        optOutRules = 'disabled_rules:\n' + optOutRules;
        optOutRules = '# rule identifiers to exclude from running\n' + optOutRules + '\n\n';
    }

    if (optInRules !== '') {
        optInRules = 'opt_in_rules:\n' + optInRules;
        optInRules = '# rule identifiers to opt in\n' + optInRules + '\n\n';
    }

    if (configuration !== '') {
        configuration = '# special configuration for rules \n' + configuration;
    }

    var fileContent = optOutRules + optInRules + configuration;

    var fileLink = generateFile(fileContent);
    downloadFile(fileLink);

    return false;
});

function downloadFile(fileLink) {
    var anchor = $('<a href="' + fileLink + '" download=".swiftLint.yml">');
    anchor.appendTo('body');
    anchor[0].click();
    anchor.remove();
}

main();