function ExcelRequest(resourceUrl,resourceName,sheetName,labelNames,labelTypes,labelKeys) {
    this.resource_url = resourceUrl;
    this.resource_name = resourceName;
    this.sheet_name = sheetName;
    this.label_names = labelNames;
    this.label_types = labelTypes;
    this.label_keys = labelKeys;
}