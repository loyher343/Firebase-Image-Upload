angular.module('imageApp', ['ngFileUpload']).controller('myCtrl', function($scope, myService) {

    $scope.submit = function(file) {
      myService.uploadImage(file)
    }

});