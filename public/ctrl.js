angular.module('imageApp',['ngFileUpload']).controller('myCtrl', function($scope, myService) {
    $scope.submit = (file) => {
        myService.uploadImage(file)
    }
// MAKE SURE YOU INJECT ngFileUpload as a dependency!!!!!!

});