#!/bin/bash
# One-time setup of a hostname, run with sudo on the VPS: adds its nginx site and its HTTPS certificate.
#   sudo bash setup-nginx.sh <config file of this folder> <domain> [other domains of the same site...]
#   e.g. sudo bash setup-nginx.sh nginx.conf pommeau-filtrant.fr www.pommeau-filtrant.fr
# It only adds its own files; if nginx rejects the config, they are removed and nginx is left as it was.
set -euo pipefail

[ "$#" -ge 2 ] || { echo "Usage : sudo bash setup-nginx.sh <fichier.conf> <domaine> [autres domaines...]"; exit 1; }
SRC="$(cd "$(dirname "$0")" && pwd)/$1"
shift
DOMAIN="$1"
AVAILABLE="/etc/nginx/sites-available/$DOMAIN"
ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

[ "$(id -u)" = 0 ] || { echo "A lancer avec sudo."; exit 1; }
[ -f "$SRC" ] || { echo "Fichier introuvable : $SRC"; exit 1; }

if [ -e "$AVAILABLE" ] || [ -e "$ENABLED" ]; then
  echo "Une config nginx existe deja pour $DOMAIN : rien n'a ete modifie."
  exit 1
fi

echo "==> Verification de la config nginx actuelle"
nginx -t

echo "==> Ajout du site $DOMAIN"
cp "$SRC" "$AVAILABLE"
ln -s "$AVAILABLE" "$ENABLED"
if ! nginx -t; then
  rm -f "$ENABLED" "$AVAILABLE"
  echo "nginx a refuse la nouvelle config : elle a ete retiree, rien n'a change."
  exit 1
fi
systemctl reload nginx

echo "==> Certificat HTTPS"
domains=()
for name in "$@"; do domains+=(-d "$name"); done
certbot --nginx "${domains[@]}" --redirect

echo "==> Termine : https://$DOMAIN"
