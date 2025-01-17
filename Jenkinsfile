pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'  // e.g., docker.io or registry.example.com
        IMAGE_NAME = 'akhiltofficial/saas' // e.g., your DockerHub username/repo or custom repo
        VERSION = "${BUILD_NUMBER}" // Use Jenkins build number as version
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
                        sh docker login docker.io -u akhiltofficial -p Kolathara10@
                        // Push Docker image
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
                    
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
