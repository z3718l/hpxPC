// JavaScript source code
hpxAdminApp.factory('exportService', function ($http, EXPORT_URL,Upload) {
    return {
        exportExcel: function (func, token, requestBody) {
            return $http({
                method: 'POST',
                url: EXPORT_URL + "/tools/excel?func=" + func,
                data: requestBody,
                headers: {
                    'Authorization': 'Bearer ' + token
                }

            });
        },
        uploadPublication: function (token, file) {
            return Upload.upload({
                url: EXPORT_URL + "/tools/excelImport?func=serviceByPublication", //upload.php script, node.js route, or servlet url
                method: 'POST',
                file: file,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {        // file is uploaded successfully
                console.log(data);
            });      //.error(...)
            //.then(success, error, progress);
            // access or attach event listeners to the underlying XMLHttpRequest.
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})
        }
    }
});
