provider "google" {
  project = "project-id"
  region  = "europe-west1"
}

resource "google_container_cluster" "primary" {
  name     = "yahtzee-cluster"
  location = "europe-west1-b"
  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "yahtzee-node-pool"
  location   = "europe-west1-b"
  cluster    = google_container_cluster.primary.name
  node_count = 2S

  node_config {
    preemptible  = true
    machine_type = "e2-medium"

    labels = {
      env = "dev"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

output "kubernetes_cluster_name" {
  value = google_container_cluster.primary.name
}