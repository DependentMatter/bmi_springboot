# BMI Microservices Project

This project is a full-stack microservices application for calculating and storing BMI (Body Mass Index) data. It features:
- **Frontend**: React app for user input and result display
- **Backend**: Spring Boot REST API for BMI calculation and MySQL persistence
- **Database**: MySQL (as a Kubernetes StatefulSet)
- **DevOps**: Docker, Kubernetes, Helm, Jenkins, Trivy, Artifactory, Vault, Terraform, Ansible

---

## How the Project Works
1. **Frontend** collects user data (name, age, height, weight) and sends it to the backend.
2. **Backend** calculates BMI, stores the record in MySQL, and returns the result.
3. **MySQL** stores all BMI records.
4. **Kubernetes** orchestrates all services.
5. **CI/CD** automates build, test, security scan, artifact storage, and deployment.
6. **Vault** manages sensitive data.
7. **Terraform** provisions AWS EKS cluster.
8. **Ansible** automates deployment to Kubernetes.

---

## Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+
- Docker
- kubectl
- AWS CLI (for AWS deployment)
- Terraform
- Ansible
- Jenkins (or GitHub Actions)
- Trivy
- Access to DockerHub, Artifactory, and Vault

---

## Running Locally (Minikube or Local K8s)

### 1. Build Backend
```
cd myWebSite
mvn clean package -DskipTests
```

### 2. Build Frontend
```
cd frontend
npm install
npm run build
```

### 3. Build Docker Images
```
docker build -t bmi-backend:latest .
docker build -t bmi-frontend:latest ./frontend
```

### 4. Start Local MySQL (optional for local test)
```
docker run --name mysql -e MYSQL_ROOT_PASSWORD=your_mysql_password -e MYSQL_DATABASE=bmidb -p 3306:3306 -d mysql:8.0
```

### 5. Update Kubernetes Secrets
Edit `k8s/mysql-secret.yaml` with your MySQL username and password.

### 6. Deploy to Local Kubernetes
```
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-statefulset.yaml
kubectl apply -f k8s/service-mysql.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/service-frontend.yaml
```

### 7. Access the App
- Frontend: `minikube service bmi-frontend-service` or `kubectl port-forward svc/bmi-frontend-service 3000:80`
- Backend: `kubectl port-forward svc/bmi-backend-service 8081:8081`

---

## Running on AWS (EKS)

### 1. Provision EKS Cluster with Terraform
```
cd terraform
terraform init
terraform apply
```
Update `variables.tf` with your AWS region, cluster name, and subnet IDs.

### 2. Configure kubectl for EKS
```
aws eks --region <region> update-kubeconfig --name <cluster_name>
```

### 3. Build & Push Docker Images
```
docker build -t <your-dockerhub-username>/bmi-backend:latest .
docker build -t <your-dockerhub-username>/bmi-frontend:latest ./frontend
docker push <your-dockerhub-username>/bmi-backend:latest
docker push <your-dockerhub-username>/bmi-frontend:latest
```

### 4. Update Image References
Edit `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` with your DockerHub image names.

### 5. Set Up Secrets (Vault or Kubernetes Secret)
- For Vault: configure your apps to use Vault for DB credentials.
- For K8s Secret: edit and apply `k8s/mysql-secret.yaml`.

### 6. Deploy to EKS
```
cd k8s
kubectl apply -f mysql-secret.yaml
kubectl apply -f mysql-statefulset.yaml
kubectl apply -f service-mysql.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f service-backend.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f service-frontend.yaml
```

### 7. Access the App
- Use the AWS LoadBalancer endpoint from `bmi-frontend-service`.

---

## CI/CD Pipeline (Jenkins)
- See `cicd/Jenkinsfile` for full pipeline: build, test, scan, push, upload, deploy.
- Use `cicd/update_build_number.sh` to increment build numbers.
- Use `cicd/ansible_deploy.yml` for automated deployment with Ansible.

---

## Security & Secrets
- Use Vault or Kubernetes Secrets for DB credentials and sensitive data.
- See `k8s/vault-secret.yaml` for Vault integration example.

---

## Notes
- Update all placeholder values (DockerHub username, Artifactory URL, Vault token, etc.) before running.
- For production, use secure storage for all secrets and enable HTTPS.
- For troubleshooting, check pod logs: `kubectl logs <pod-name>`

---

## Project Structure
- `frontend/` - React app
- `src/main/java/com/bmi/` - Spring Boot backend
- `k8s/` - Kubernetes manifests
- `terraform/` - Terraform scripts for AWS
- `cicd/` - Jenkinsfile, Ansible, and scripts

---

## Contributors
- Your Name

---

## License
MIT
