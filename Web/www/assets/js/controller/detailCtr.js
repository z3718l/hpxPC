hpxAdminApp.controller('detailCtr', ['$scope', '$rootScope', function ($scope, $rootScope, $window) {

	            $rootScope.saveDetail = function () {
	                KindEditor.sync('#textareDetail');
	                alert(document.getElementById('textareDetail').value);
	                $rootScope.detail = document.getElementById('textareDetail').value;
	                window.history.go(-1);

	                //window.location.href = "/www/views/portalInformationInfo.html";
	            }
	        }]);