# Frontend Project with Docker

This project uses Docker to containerize the React frontend application and serve it via Nginx.

## Commands

### 1. Build the Docker image

To build the Docker image for the frontend, run the following command:

```bash
docker build -t frontend .
```

### 2. Run the Docker container

```bash
docker run -p 3000:80 frontend
```
