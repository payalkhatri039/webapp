packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1.0.0"
    }
  }
}

variable "project_id" {
  type    = string
  default = env("PROJECT_ID")
}

variable "zone" {
  type    = string
  default = env("ZONE")
}

variable "source_image_family" {
  type    = string
  default = env("SOURCE_IMAGE_FAMILY")
}

variable "disk_type" {
  type    = string
  default = env("DISK_TYPE")
}

variable "disk_size" {
  type    = number
  default = env("DISK_SIZE")
}

variable "ssh_username" {
  type    = string
  default = env("SSH_USERNAME")
}

source "googlecompute" "csye6225-app-custom-image" {
  project_id              = var.project_id
  source_image_family     = var.source_image_family
  zone                    = var.zone
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = "csye6225-{{timestamp}}"
  image_description       = "Custom Image for GCP CSYE6225 app"
  image_family            = "csye6225-image-family"
  image_storage_locations = ["us"]
  ssh_username            = var.ssh_username
}

build {
  sources = [
    "sources.googlecompute.csye6225-app-custom-image"
  ]

  provisioner "shell" {
    scripts = [
      "./update.sh",
      "./envSetup.sh",
    ]
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./systemD/systemdService.service"
    destination = "/tmp/"
  }
  
  provisioner "file" {
    source      = "./logConfig.yaml"
    destination = "/etc/google-cloud-ops-agent/"
  }

  provisioner "shell" {

    scripts = [
      "./unzip.sh",
      "./setDependencies.sh",
      "./systemD/systemdSetup.sh",
      "./agentOps.sh"
    ]
  }
}