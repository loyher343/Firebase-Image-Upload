angular.module('imageApp').service('myService', function($http) {




    // THIS IS WHERE THAT LONG BLOCK OF CODE FROM
    // STEP 7 WILL BE GOING!!!!

this.uploadImage = (file) => {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child('images/' + file.name).put(file);
    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                    break;
            }
        }, function(error){
        }, function() {
        let downloadURL = [uploadTask.snapshot.downloadURL];
        console.log(downloadURL)
        return $http.post(`/api/images`, downloadURL);
        });

}
});