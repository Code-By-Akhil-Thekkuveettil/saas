pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io' // Docker registry, e.g., docker.io
        IMAGE_NAME = 'akhiltofficial/saas' // DockerHub username/repo
        VERSION = "${BUILD_NUMBER}" // Use Jenkins build number as the version
        REPO_URL = 'github.com/Code-By-Akhil-Thekkuveettil/practice.git'
        DEPLOYMENT_FILE_PATH = 'kubernetes/minikube/Deployment.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the Git repository
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image with a version tag
                    sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Login to Docker registry securely
                        sh "echo ${DOCKER_PASSWORD} | docker login ${REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"
                        // Push Docker image
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
                    }
                }
            }
        }

        stage('Update Deployment YAML') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    script {
                        // Update the Deployment YAML with the new image and push changes to Git
                        sh """
                        rm -rf repo
                        git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_URL} repo
                        cd repo
                        sed -i 's|image: .*|image: ${REGISTRY}/${IMAGE_NAME}:${VERSION}|' ${DEPLOYMENT_FILE_PATH}
                        git add ${DEPLOYMENT_FILE_PATH}
                        git commit -m "Update image to ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${REPO_URL} main
                        """
                    }
                }
            }
        }
    }
}
