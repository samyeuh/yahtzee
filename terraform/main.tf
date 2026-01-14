# 1. Définition du fournisseur (Provider)
provider "google" {
  project = "ton-project-id" # À remplacer par ton ID de projet Google Cloud
  region  = "europe-west1"
}

# 2. Création du cluster Kubernetes (GKE)
resource "google_container_cluster" "primary" {
  name     = "yahtzee-cluster"
  location = "europe-west1-b"

  # On crée un cluster "zonal" (plus simple et moins cher)
  # On supprime le pool de nœuds par défaut pour en créer un personnalisé plus bas
  remove_default_node_pool = true
  initial_node_count       = 1
}

# 3. Définition des machines (Node Pool)
resource "google_container_node_pool" "primary_nodes" {
  name       = "yahtzee-node-pool"
  location   = "europe-west1-b"
  cluster    = google_container_cluster.primary.name
  node_count = 2 # Le nombre de machines virtuelles dans ton cluster

  node_config {
    preemptible  = true # Utilise des machines moins chères (idéal pour un projet étudiant)
    machine_type = "e2-medium"

    labels = {
      env = "dev"
    }

    # Autorisations nécessaires pour que les nœuds communiquent avec le reste de GCP
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

# 4. Sortie (Output) : Affiche l'adresse IP du cluster une fois créé
output "kubernetes_cluster_name" {
  value = google_container_cluster.primary.name
}