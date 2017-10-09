# Firebase Image Uploads

There are a lot of different services that allow you to upload and store images. A lot of them are confusing and take way too long to set up. To think, that's time that you could have been adding more features.

***

### What is Firebase? 
Firebase is a BaaS(Backend As A Service) ran by Google that allows you to do many things ranging from authentication, to cloud storage, to database functionality. They even give you free hosting, but I digress. For this brown bag, we will focus on Cloud Storage.

___

# Summary

In this brown bag, we will: 
* Set up Firebase
* Upload images to Firebase
* Recieve the URL of the image uploaded. 
* Send those URLs to your database for your use.

***

## Step 1

### Summary

I've included an `index.js` file with everything set up, you'll just need to install the dependencies and run `npm init -y`. This should be second nature by now. 

### Instructions

* Run `npm-init -y`.
* Use npm to install and save `express`, `body-parser`, `cors`, and `massive`.
* Run the server with `nodemon`.



***

# Step 2

## Summary

In this step, we will go to the Firebase website and create a project.

### Instructions

* Head to Firebase.com and login with your Gmail account.
* Click the blue `Get Started` button.
* `Add a Project` and name it whatever you like. 
* `Create the Project`


You should now be on your `Firebase Console`. You'll see things like `Add Firebase to your web app` and a sidebar with a bunch of buttons. 




___

# Step 3

## Summary 
In this step, we will set up Firebase's storage options and change the permissions that way you can save and retrieve pictures.

### Instructions

* Head over to your `Firebase Console` and click the `Storage` button on the left hand side. 
* Click `Get Started`.
    You'll be shown some `Security Rules`. Firebase is set up by default that you must be authenticated to `read`(view uploaded images) and `write`(upload and delete images). 
For the scope of this brown bag, we will remove any authentication features that restrict read and write privileges. 
* Click `Got it`.
* On the top left of your `Firebase Console` you'll see two tabs, `Files` and `Rules`. Click `Rules`.
* On `Line 4`, you'll see `allow read, write: if request.auth != null;`. 
* Change this to `allow read, write: if true`. 
* Press `Publish`.
    This allows us to upload images without authentication. On a production level, you wouldn't want to do this. If you want to learn more about this, find me and I'd be happy to explain more in depth.

Now we are ready to set up project file to allow our project to talk to Firebase.

___

# Step 4

## Summary

In this step, we will add Firebase to our project. 
##### IN ORDER TO USE ANY FIREBASE FUNCTIONALITY, YOU MUST COMPLETE THIS STEP.

### Instructions
* Head to your `Firebase Console` and click `Add Firebase to your web app`.
* Copy the code that is provided to you.
The first script is simply allowing us to use any of the Javascript tools that Firebase provides. 
The second script includes information for Firebase that allows us to talk to our Firebase Project. 
* Head over to your `index.html` and paste the copied information into the bottom of the `<head>` tag. 
    I've included an identifier inside your index.html that will specify where to put it.

___
# Step 5 
## Summary 
Now that we've included Firebase in our project, we are ready to start uploading images. Before we do that, we need to include a couple of things that allow our Angular Project to properly upload images.

### Instructions

* Head over to your project folder and look at the `public` folder. 
You'll see an unusual file, `ng-file-upload.js`. This file is a custom `Angular Directive` that allows your Angular App to properly upload images. If you want to read more information about it, check out [their Github repo](https://github.com/danialfarid/ng-file-upload).
##### [Here's a direct download link for future use](
On your production project, you'll want to simply copy and paste this `ng-file-upload.js file` into your `public folder`. 
* Include this as a script tag into your `index.html` along side the rest of your scripts. 

```html
    <script src="ng-file-upload.js"></script>
```

#### [Here's a download link for future use](https://firebasestorage.googleapis.com/v0/b/brownbag-cca6d.appspot.com/o/ng-file-upload.js?alt=media&token=8b11c441-8709-4347-b36b-4035d82e8ea4)

Now we are ready to make an upload field that allows us to upload our pictures.

***

# Step 6

## Summary 
In this step, we will include the HTML elements that will allow us to upload images. 

____

### Instructions

* Copy and paste the following text into the body of the `index.html` file.
```html
<form name="form">
    <img style="width: 300px;" ngf-thumbnail="image">
    <button name="image" ngf-select ng-model="image">Upload image</button>
    <button ng-click="submit(image)">Submit</button>
</form>
```
These elements use the `ng-file-upload` directive to convert the image into a file type that Angular can read and process.

The `<button name="image" ngf-select ng-model="image">Upload image</button>` element will open a file select window that you will select image you want to upload.

The `<img style="width: 300px;" ngf-thumbnail="image">` element will provide a thumbnail of the image you want to upload. This element is stylable to your liking.

The `<button ng-click="submit(image)">Submit</button>` element contains a standard image tag that will pass the image into a function that will ultimately upload the picture.


Now we are ready to write the Angular functions that'll allow us to actually upload the images to firebase.
***

# Step 7

## Summary 

In this step, we will write the functions in our Angular Controller and Service that will do the actual uploading to Firebase. 

***

### Instructions

* Head over to your `ctrl.js` file in your `public` folder.
* Inject the `ngFileUpload` dependency into your app. 
It should look something like `angular.module('imageApp', ['ngFileUpload']).controller('myCtrl', function($scope, myService) {`
* Head over to the `ctrl.js` and include the following code into the controller:
```js
$scope.submit = function(file) {
      myService.uploadImage(file)
    }
```
This is what is triggered from our `Submit` button from the previous step. 

* Head over to your `service.js` file and include the following code.
    ### Bear with me, it's a long block of code but I'll explain what it does.
```js
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
    }, function(error) {

    }, function() {
        let downloadURL = [uploadTask.snapshot.downloadURL];
        console.log(downloadURL)
        // return $http.post(`/api/image`, downloadURL);
        });

}
````

The function first passes in `file` which is the file we are uploading.

Then `const storageRef` is essentially setting up what Firebase needs to do. In this case, it's referencing the default `Storage Bucket`. Think of a Storage Bucket as a file that we'll be putting our pictures into.

Next, `const uploadTask = storageRef.child('images/' + file.name).put(file);`is defining where we will put the image along with naming the file. You'll be able to visually see this once we have everything up and running. Then,  the `.put(file)` at the end is actually uploading the file. 

The `uploadTask....` is the most confusing part. I won't go too much into detail with it. This essentially is tracking the progress of the upload. `state_changed` is listening for updates in the upload process. `snapshot` is a term used by Firebase that describes the current state, or data of whatever you are defining. In our case, it's the file as it's being uploaded. 

The `const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;` is setting a constant equal to the upload progress. For example, if it's 50% uploaded, `progress` will equal 50. It then will log the progress of the upload in your console.

Then there is a switch statement that is passing in the `snapshot.state`, or the progress of the upload. If the picture is being uploaded, it will execute the `firebase.storage.TaskState.RUNNING` case and log that the image is running.

Then when the picture has been uploaded, we'll be provided with a `uploadTask.snapshot.downloadURL`. SUCCESS! This is the image url that you'll be passing into your database.

The `function(error)...` listens for errors. You must have this included in your code or you will not be able to recieve your image URL.

The `$http.post....` line will be used uploading the image to your database. Ignore it for now.

That wasn't so bad, right?

* Now open up your browser and navigate to `localhost:3000`. Make sure that your server is running (`nodemon`).
* Open up your Developer Tools and open up your console.
* Try uploading an image and watch the console.

If you've followed all these steps to the teeth, you'll have an image URL in your console.



Now that we have successfully uploaded our images to Firebase, let's go to our console just to make sure they were uploaded.

* Go to Firebase.com and open your project.
* Open up the `Storage` tab on the sidebar. 
* Click the `images/` folder.
* Revel in the fact that you succesfully uploaded your picture.

Now let's upload that URL we got into our database.

***

# Step 8 

## Summary

Congratulations, you've succesfully uploaded a picture to Firebase and now have a URL to work with. Now let's upload that image to a database.

### Instructions 

* Open up your favorite PostgreSQL client and create a new database named `pictures`.
* Create a new table and name it `pictures`.
* Inside of that table, create a column named `image_url` with the type `VARCHAR(300)`
    We are used to creating columns with types like `integer` or `text` but because our     image url has some symbols like `/` and `:`, we have to set it to VARCHAR(300).         VARCHAR accepts symbols as well as alphanumeric strings.
* Save your table.
* Head over to the `config.js` file and route it to the table that you created.
* Head back over to your service and uncomment the `return $http.post.....` line. 
* Head over to your `index.js` file and uncomment the `app.post....` function.
* Go to the `imageCtrl.js` file in the `server` folder and uncomment the `uploadImages`. function.
* Go to your `db` folder and include the following code.
```sql
INSERT INTO pictures (picture_url) VALUES ($1);

```

Now that we've set up all of our database functionality, let's head over to `localhost:3000` and test to see if it works.

Try uploading an image. Look at your console and see if it uploads and returns the URL. Go check out your database. Did it save that URL to your database? 

If you answered `yes` to both of these questions you rock. 
## You've successfully connected Firebase to your app, uploaded an image to Firebase, returned the image URL, and saved it to your database.



