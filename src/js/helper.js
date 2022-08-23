function handleCheckboxChanged(checkbox) {
    var ruleContainerName = "#rule-"+checkbox.id
    $(ruleContainerName).toggleClass("checked", this.checked);
}
