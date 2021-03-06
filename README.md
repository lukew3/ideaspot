# Ideaspot server

## Development
### Setup
1. [Install MongoDB](https://docs.mongodb.com/manual/installation/) on your computer
2. Clone the repo
3. Install python requirements by using `pip install -r requirements.txt`. It is recomended that you create a virtual environment with `python -m venv venv` to prevent installing packages outside of this project.
4. Install the frontend requrements by running `npm install` inside of the frontend directory
5. (Optional) If you want to enable searching text, install mongosh and run these commands:
```
mongosh
use ideaspot
db.idea.createIndex({title:"text",description:"text"})
```
### Starting the app
If you are on linux/mac and followed the setup instructions correctly, you call the start script with `./start` to start the server. If not follow the instructions below.
1. Inside of the main directory, run `python app.py`. Make sure you are in your virtualenv if you used one
2. Inside of the frontend directory, run `npm start`.
You can now interact with the site at `localhost:3000`
