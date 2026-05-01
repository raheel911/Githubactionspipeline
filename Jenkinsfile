pipeline {
    agent any 

    stages {
        stage('Build and Deploy') {
            steps {
                script {
                    echo '🚀 Starting Deployment...'
                    // Build and start containers
                    sh 'docker compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Application deployed successfully!'
        }
        failure {
            echo '❌ Deployment failed. Check the logs above.'
        }
    }
}