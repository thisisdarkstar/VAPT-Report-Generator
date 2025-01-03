# VAPT Report Generator

## Setting Up a Python Virtual Environment

## Installing `venv` Package

To create a virtual environment, you need to have the `venv` module installed. It is included by default in Python 3.3 and later.

## Creating a Virtual Environment

### On Linux and macOS

```sh
python3 -m venv myenv
```

### On Windows

```sh
python -m venv myenv
```

## Activating the Virtual Environment

### On Linux and macOS

```sh
source myenv/bin/activate
```

### On Windows

```sh
myenv\Scripts\activate
```

## Deactivating the Virtual Environment

To deactivate the virtual environment, simply run:

```sh
deactivate
```

## Installing Requirements

Once the virtual environment is activated, you can install the required packages using `pip` and a `requirements.txt` file.

```sh
pip install -r requirements.txt
```

This will install all the packages listed in the `requirements.txt` file into your virtual environment.

## Starting the Server

Once all the requirements are installed, you can start the server using the following command:

```sh
python app.py
```

This will start the application, and you should see output indicating that the server is running. 

## Accessing the Server

Navigate to `http://127.0.0.1:5000` in your web browser to access the server.

### Web UI

To get a visual understanding of the web UI, you can refer to the following GIF:

![Web UI Demo](./sample%20output/2025-01-03%2014-49-24%20(1).gif)

### Output file

![The generate report](./sample%20output/2025-01-03%2014-54-45.gif)