pipeline {
  agent any

  environment {
    CI = 'true'
    DATABASE_URL = 'postgresql://wc2026:wc2026@localhost:5432/wc2026'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Quality Gate') {
      parallel {
        stage('Lint') {
          steps {
            script {
              if (isUnix()) {
                sh 'npm run lint'
              } else {
                bat 'npm run lint'
              }
            }
          }
        }
        stage('Test') {
          steps {
            script {
              if (isUnix()) {
                sh 'npm test'
              } else {
                bat 'npm test'
              }
            }
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'apps/**/dist/**', allowEmptyArchive: true
      junit testResults: '**/junit.xml', allowEmptyResults: true
    }
  }
}
