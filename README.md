# Build My Idea server

## Development
### Setup
1. [Install MongoDB](https://docs.mongodb.com/manual/installation/) on your computer
1. Clone the repo
1. Create a virtualenvironment called venv and install the python requirements to it using `pip install -r requirements.txt`
1. Install the frontend requrements by running `npm install` inside of the frontend directory
### Starting the app
If you are on linux/mac and followed the setup instructions correctly, you call the start script with `./start` to start the server. If not follow the instructions below.
1. Inside of the main directory, run `python app.py`. Make sure you are in your virtualenv if you used one
1. Inside of the frontend directory, run `npm start`.
You can now interact with the site at `localhost:3000`
