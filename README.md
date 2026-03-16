# 3-Tier Java Microservice Application

This is a simple 3-tier web application designed for practicing DevOps and AWS deployment concepts.

## Architecture
1. **Frontend**: Static HTML/JS served by an Nginx container.
2. **Backend**: A Java Spring Boot REST API for managing `Employees`.
3. **Database**: PostgreSQL (Locally using Docker, or AWS RDS in Cloud).

## Local Development
To run this application locally, you need [Docker](https://docs.docker.com/get-docker/) installed.

1. Navigate to the project root directory.
2. Run `docker-compose up -d --build`.
3. Visit the frontend at `http://localhost`.
4. The backend will be available at `http://localhost:8080/api/v1/employees`.
5. The PostgreSQL database is exposed on `localhost:5432` with user `postgres` and password `postgrespassword`.

To stop the application, run:
```bash
docker-compose down
```

## AWS Deployment Guide

This app is designed to be easily deployed to AWS. Here is a high-level guide.

### 1. Database (AWS RDS - PostgreSQL)
- Create an RDS PostgreSQL instance.
- Ensure the Security Group allows inbound traffic on port `5432` from your compute instances (EC2/EKS/ECS).
- Note down your RDS **Endpoint**, **Username**, and **Password**.

### 2. Backend (AWS ECS, EKS, or EC2)
- Build the backend Docker image and push it to Amazon ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
  docker build -t 3-tier-backend ./backend
  docker tag 3-tier-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/3-tier-backend:latest
  docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/3-tier-backend:latest
  ```
- Deploy the container. Pass the following environment variables to the backend container to connect it to AWS RDS:
  - `DB_HOST`: Your RDS Endpoint URL (e.g., `mydb.xxxxx.eu-central-1.rds.amazonaws.com`)
  - `DB_PORT`: `5432`
  - `DB_NAME`: `employees_db` (or whatever DB you created on RDS)
  - `DB_USERNAME`: Your RDS master username
  - `DB_PASSWORD`: Your RDS master password

### 3. Frontend (AWS S3, EC2, ECS, or EKS)
- Build and push the frontend image similarly to the backend.
- **Important Configuration**: Update the `API_URL` variable in `frontend/app.js` to point to the actual AWS Load Balancer or EC2 public IP of your backend API before building the frontend image! (e.g. `http://my-backend-lb-123.eu-central-1.elb.amazonaws.com:8080/api/v1/employees`).
- Deploy the frontend container and expose port `80`.

By clearly separating the UI from the Backend, and making the Datastore configurable via environment variables, this application serves as a perfect playground for DevOps concepts and AWS deployments.
