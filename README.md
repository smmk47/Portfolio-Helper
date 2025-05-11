# Portfolio-Helper AWS Deployment Guide

This guide provides instructions for deploying the Portfolio-Helper application, consisting of a React frontend and a Node.js/Express backend, to Amazon Web Services (AWS).

**GitHub Repository:** [https://github.com/smmk47/Portfolio-Helper](https://github.com/smmk47/Portfolio-Helper)

## 1. Project Overview

The Portfolio-Helper application assists users in creating and managing their professional portfolios.
-   **Frontend:** React client consuming backend services via REST APIs.
-   **Backend:** Node.js & Express service for CRUD operations, user authentication (JWT), data persistence (Amazon DocumentDB), and file uploads (Amazon S3).

## 2. Prerequisites

*   An AWS Account.
*   AWS CLI installed and configured with appropriate permissions.
*   Node.js and npm (or yarn) installed locally.
*   Docker installed locally (and on the EC2 instance later).
*   Git installed locally.
*   A code editor (e.g., VS Code).

## 3. AWS Infrastructure Setup

Before deploying the application code, set up the following AWS resources:

1.  **VPC (Virtual Private Cloud):**
    *   Use an existing default VPC or create a new one (e.g., `project_vpc-vpc`).
    *   Ensure you have public and private subnets if needed, though for this setup, public subnets might suffice.

2.  **Security Groups:**
    *   **Backend EC2 SG (e.g., `ec2_sg`):**
        *   **Inbound:**
            *   Allow TCP on your backend port (e.g., 5000) from the Elastic Beanstalk environment's IP range or `0.0.0.0/0` (for broader access, restrict if possible).
            *   Allow SSH (TCP port 22) from your IP address for management.
        *   **Outbound:**
            *   Allow TCP on port 27017 to your DocumentDB Security Group.
            *   Allow HTTPS (TCP port 443) to S3 endpoints (`0.0.0.0/0`).
    *   **DocumentDB SG (e.g., `docdb_sg`):**
        *   **Inbound:**
            *   Allow TCP on port 27017 from your Backend EC2 Security Group (`ec2_sg`).
    *   **Elastic Beanstalk SG (Managed by EB, but ensure it allows):**
        *   **Inbound:**
            *   Allow HTTP (TCP port 80) from `0.0.0.0/0`.
            *   Allow HTTPS (TCP port 443) from `0.0.0.0/0` (if using SSL).

3.  **IAM Roles & Policies:**
    *   **EC2 Backend Role (e.g., `backend_role`):**
        *   Attach policies for:
            *   AmazonS3FullAccess (or a more restrictive policy granting `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` to your specific bucket).
            *   AmazonDocDBFullAccess (or `AmazonRDSFullAccess` if DocDB policies aren't granular enough, or create a custom policy for specific DocumentDB actions).
    *   **Elastic Beanstalk Service Role (e.g., `aws-elasticbeanstalk-service-role`):** Standard role, usually created automatically or you can create it.
    *   **Elastic Beanstalk EC2 Instance Profile (e.g., `aws-elasticbeanstalk-ec2-role`):** Standard role for EB instances.

4.  **S3 Bucket (e.g., `your-portfolio-helper-bucket`):**
    *   Create a new S3 bucket.
    *   Configure bucket policies/CORS if frontend needs direct read access (e.g., for public assets or signed URLs for private ones). For this project, backend handles uploads and can provide signed URLs.
    *   Ensure block public access settings are appropriate (likely block all, and use IAM/signed URLs).

5.  **Amazon DocumentDB Cluster:**
    *   Provision a DocumentDB cluster.
    *   Choose the VPC and subnets created/selected earlier.
    *   Attach the `docdb_sg` security group.
    *   Note down the cluster endpoint (connection string). You'll need the username and password you set during creation.

## 4. Backend Deployment (EC2 + Docker)

1.  **Launch EC2 Instance (e.g., `backend_ec2`):**
    *   Choose an AMI (e.g., Amazon Linux 2).
    *   Instance Type (e.g., `t2.micro` or `t3.micro`).
    *   Configure Network: Select your VPC and a public subnet.
    *   Assign Public IP: Enable.
    *   IAM Role: Attach the `backend_role` created earlier.
    *   Security Group: Select the `ec2_sg`.
    *   Launch with an SSH key pair you have access to.

2.  **Connect to EC2 Instance:**
    ```bash
    ssh -i /path/to/your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
    ```

3.  **Install Docker & Git on EC2:**
    ```bash
    sudo yum update -y
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user # Log out and log back in for this to take effect
    sudo yum install git -y
    ```
    *After `usermod`, log out and log back in to apply group changes, or run `newgrp docker`.*

4.  **Clone Backend Code:**
    (Assuming your backend code is in a `backend` directory in the main repository)
    ```bash
    git clone https://github.com/smmk47/Portfolio-Helper.git
    cd Portfolio-Helper/backend
    ```

5.  **Configure Backend Environment Variables:**
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5000 # Or your desired backend port
    MONGO_URI=mongodb://YOUR_DOCDB_USER:YOUR_DOCDB_PASSWORD@YOUR_DOCDB_CLUSTER_ENDPOINT:27017/YOUR_DB_NAME?tls=true&tlsCAFile=global-bundle.pem&retryWrites=false
    JWT_SECRET=YOUR_VERY_SECRET_JWT_KEY
    S3_BUCKET_NAME=your-portfolio-helper-bucket
    AWS_REGION=us-east-1 # Or your bucket's region
    # If not using IAM Role (not recommended for EC2), add:
    # AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
    # AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
    ```
    *   **Note on `MONGO_URI`:** For DocumentDB, you'll need the `global-bundle.pem` file. Download it to your EC2 instance:
        ```bash
        wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
        ```
        Ensure your backend code correctly references this CA file if needed by the MongoDB driver. Place it in the `backend` directory or adjust the path in `MONGO_URI`.

6.  **Build and Run Docker Container:**
    (Assuming you have a `Dockerfile` in your `Portfolio-Helper/backend` directory)
    ```bash
    # Navigate to the backend directory if not already there
    cd /path/to/Portfolio-Helper/backend

    # Build the Docker image
    docker build -t portfolio-helper-backend .

    # Run the Docker container
    docker run -d -p 5000:5000 --env-file .env --name portfolio-backend portfolio-helper-backend
    ```
    *   The `-p 5000:5000` maps port 5000 on the host (EC2) to port 5000 in the container (assuming your Node.js app listens on 5000).
    *   `--env-file .env` loads environment variables from the `.env` file.

7.  **Verify Backend:**
    Access `http://YOUR_EC2_PUBLIC_IP:5000/api/some-test-route` to see if it's running.

## 5. Frontend Deployment (Elastic Beanstalk)

1.  **Prepare Frontend Code:**
    (Assuming your frontend code is in a `frontend` directory in the main repository)
    ```bash
    # Navigate to the frontend directory locally
    cd /path/to/Portfolio-Helper/frontend

    # Install dependencies
    npm install # or yarn install
    ```

2.  **Configure Frontend Environment Variables:**
    Create a `.env.production` file in the `frontend` directory (or configure EB environment properties later):
    ```env
    REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:5000/api
    ```
    *   Replace `YOUR_EC2_PUBLIC_IP:5000` with the actual public IP and port of your backend EC2 instance.

3.  **Build Frontend:**
    ```bash
    npm run build # or yarn build
    ```
    This will create a `build` folder with static assets.

4.  **Deploy to Elastic Beanstalk:**
    *   **Option A: Using AWS Console**
        1.  Go to the Elastic Beanstalk service in the AWS Console.
        2.  Click "Create application".
        3.  Application name: `Portfolio-Helper-Frontend`.
        4.  Platform: `Node.js`.
        5.  Application code: Upload your code.
            *   Zip the contents of the `frontend` directory **INCLUDING** the `build` folder, `package.json`, and any server file (e.g., `server.js` if you're serving static files with Express on EB, or just `package.json` and `build` if EB handles it).
            *   A simple `server.js` for serving React build:
                ```javascript
                // server.js (in frontend root, alongside package.json)
                const express = require('express');
                const path = require('path');
                const app = express();
                const port = process.env.PORT || 8080;

                app.use(express.static(path.join(__dirname, 'build')));

                app.get('/*', function (req, res) {
                   res.sendFile(path.join(__dirname, 'build', 'index.html'));
                });

                app.listen(port, () => console.log(`Server listening on port ${port}`));
                ```
                And update `package.json` start script: `"start": "node server.js"`
            *   Alternatively, zip only the contents of the `build` folder and configure EB to serve static files (might require Nginx configuration within EB). The Node.js platform with a simple Express server is often easier.
        6.  Upload the ZIP file.
        7.  Click "Configure more options" if you need to set environment variables (like `REACT_APP_API_URL` if not baked into the build, though baking it in via `.env.production` is common).
        8.  Create application. Wait for the environment to launch.

    *   **Option B: Using EB CLI** (Recommended for easier updates)
        1.  Install EB CLI: `pip install awsebcli --upgrade --user`
        2.  Navigate to your `frontend` directory.
        3.  Initialize EB: `eb init -p Node.js Portfolio-Helper-Frontend` (Follow prompts)
        4.  Create environment: `eb create portfolio-helper-frontend-env`
        5.  To deploy updates: `eb deploy`

5.  **Verify Frontend:**
    Once the Elastic Beanstalk environment is healthy, access the URL provided by EB.
