# ArtificEon

ArtificEon is a Blog Website with Protected Routes and Pusher Integration. The Protected Admin route allows for Admins, Managers and Employees to create notes and assign new roles to different users. Pusher is integrated to allow for real-time communication between clients when creating or editing a Blog Post.

Protected Admin/Manager/Employee route is located at "/dash".

## Installation

1. Clone the repository: `git clone https://github.com/M4thDJ/ArtificEon.git`
   
3. Install the dependencies: `npm install`

## Usage

Requires env values to be filled in for the app to work correctly. In the root of the project, create a ".env" and ".env.local" file with the following keys shown below. Keys prefixed with "NEXT_PUBLIC_" should be added to the ".env.local" file:

Create a Pusher account and create your App Keys: https://pusher.com

- Environment keys:

   - PUSHER_SECRET

   - NEXT_PUBLIC_PUSHER_APP_ID

   - NEXT_PUBLIC_PUSHER_KEY

   - NEXT_PUBLIC_PUSHER_CLUSTER

<br><br>
Create a Cloudinary account and get your Cloud name and necessary Access Keys: https://cloudinary.com

- Environment keys:

   - CLOUDINARY_CLOUD_NAME

   - CLOUDINARY_KEY

   - CLOUDINARY_SECRET

<br><br>
Have a DB url at hand. If no DB_URI key is found in the .env file, a local url "mongodb://127.0.0.1:27017/artificeon" will be used.
As an example, a Mongo Atlas Cluster can be used: https://www.mongodb.com

- Environment Keys:

   - DB_URI=Your_DB_Url

<br><br>
ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET values:
- Option 1: Use preferred method for generation.
- Option 2: Open terminal - type "node" -> type "require('crypto').randomBytes(64).toString('hex')" for each of the Keys
- Environment Keys:
   - ACCESS_TOKEN_SECRET
   - REFRESH_TOKEN_SECRET

<br><br>
Other Environment Keys:

- NODE_ENV=production /or/ development
- APP_URI=Production_Url /or/ http://localhost:3000 is used automatically - (used to define the allowed origins for cors)

<br><br>

<b>Other files to note:</b>
- next.config.js:
  - publicRuntimeConfig.PRODUCTION: true/false depending on your current environment.


## Known Issues

- Currently there is an issue with how the Blog Post Editor unmounts. A brute force fix has been implemented by refreshing the page after being redirected away. This fix works until the underlying cause has been found.

## Contributing

Thank you for considering contributing to ArtificEon! Please follow the steps below:

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.
