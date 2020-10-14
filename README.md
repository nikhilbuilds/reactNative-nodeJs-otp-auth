# OTP authentication with react-native and nodejs api, using AWS lambda and SNS services

Using this you can built nodeJS(express) APIs and android app in your local machine and deploy APIs in AWS lambda with just few commands.

## Run locally

 **1. server**
   - `cd server`
   - `npm install`
   -  edit [/config/default.json](/server/config/default.json), with your credentials
   - `npm run dev`
      
      
 **2. react-native app**
     - `cd rnAuth`
     - `npm install`
      
 **Start Metro**
     - `npx react-native start`
      
 **Start your application**
     - `npx react-native run-android` 
  
## About the files and folders
  
**1. server**
   
   * app - Folder contains Models, Middlewares, Logics (Controllers and Routes)
   * config - Folder contains db, JWT, AWS credentials and db connect logic
   * app.js - Contains App logic
   * lambda.js - Called by AWS lambda
   * serverless.yml - Lambda function configration.
         
**2. react-native app (android)**

  * src - Contains all screens and logics
    - Context - Folder contains hooks and redux logic
    - ResolveAuthScreen - Folder contains splashscreen 
    - api - Folder contains api endpoint link
    - screens - Folder contains all the app screens
            
  * App.js - App Logics
        
     
 ## Prerequisites for Deploying in AWS
        
   * An AWS account
   * AWS CLI installed in your machine

   ## Deployment

  Run the following command to deploy the app as AWS Lambda function
  -`npm run deploy`



   ## App Screenshots
   
   <a href="/rnAuth/app_img/img1.png"><img src="/rnAuth/app_img/img1.png" height="40%" width="40%" ></a>
   <a href="/rnAuth/app_img/img2.png"><img src="/rnAuth/app_img/img2.png" height="40%" width="40%" ></a>
   <a href="/rnAuth/app_img/img3.png"><img src="/rnAuth/app_img/img3.png" height="40%" width="40%" ></a>
