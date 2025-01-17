pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'  // e.g., docker.io or registry.example.com
        IMAGE_NAME = 'akhiltofficial/saas' // e.g., your DockerHub username/repo or custom repo
        VERSION = "${BUILD_NUMBER}" // Use Jenkins build number as version
        REPO_URL = 'https://github.com/Code-By-Akhil-Thekkuveettil/practice.git'
        DEPLOYMENT_FILE_PATH = 'kubernetes/minikube/Deployment.yml'
    }

    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image with version tag
                    sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login to the Docker registry (assuming credentialsId is set in Jenkins)
                        sh "docker login docker.io -u 'akhiltofficial' -p 'Kolathara10@'"
                        // Push Docker image
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
                    
                }
            }
        }
       stage('Update Deployment YAML') {
            steps {
                script {
                    // Replace the image in the Deployment.yml file
                    sh """
                    git clone ${REPO_URL} repo
                    cd repo
                    sed -i 's|image: .*|image: ${REGISTRY}/${IMAGE_NAME}:${VERSION}|' ${DEPLOYMENT_FILE_PATH}
                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@example.com"
                    git add ${DEPLOYMENT_FILE_PATH}
                    git commit -m "Update image to ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
                    git push origin main
                    """
                }
            }
        }
    }

