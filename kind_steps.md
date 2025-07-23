# Running the BMI Microservices Project on KIND (Kubernetes IN Docker)

This guide explains how to run the full-stack BMI microservices project on a local KIND cluster.

---

## Prerequisites
- Docker installed and running
- [KIND](https://kind.sigs.k8s.io/) installed
- kubectl installed
- Java 17+, Node.js 18+, Maven, npm

---

## 1. Create a KIND Cluster
```
kind create cluster --name bmi-cluster
```

---

## 2. Build Docker Images Locally
```
# From project root
mvn clean package -DskipTests
cd frontend && npm install && npm run build && cd ..
docker build -t bmi-backend:latest .
docker build -t bmi-frontend:latest ./frontend
```

---

## 3. Load Images into KIND
```
kind load docker-image bmi-backend:latest --name bmi-cluster
kind load docker-image bmi-frontend:latest --name bmi-cluster
```

---

## 4. Prepare Kubernetes Manifests
- Edit `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` to use `bmi-backend:latest` and `bmi-frontend:latest` (no registry prefix).
- Edit `k8s/mysql-secret.yaml` with your MySQL username and password.

---

## 5. Deploy MySQL
```
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-statefulset.yaml
kubectl apply -f k8s/service-mysql.yaml
```

---

## 6. Deploy Backend and Frontend
```
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/service-frontend.yaml
```

---

## 7. Access the Application
- Forward frontend service:
```
kubectl port-forward svc/bmi-frontend-service 3000:80
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

- Forward backend service (optional for API testing):
```
kubectl port-forward svc/bmi-backend-service 8081:8081
```

---

## 8. Cleanup
```
kind delete cluster --name bmi-cluster
```

---

## Notes
- KIND does not support LoadBalancer services by default. Use `port-forward` for local access.
- For persistent MySQL data, configure a local PersistentVolume or use hostPath.
- For troubleshooting, use `kubectl get pods`, `kubectl logs <pod>`, and `kubectl describe <resource>`.
