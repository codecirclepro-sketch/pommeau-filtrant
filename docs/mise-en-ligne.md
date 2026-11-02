# Mise en ligne de pommeau-filtrant.fr

## Ce que tu dois faire toi-même, dans l'ordre

1. **M'envoyer les infos qui manquent** (liste plus bas, « Ce qu'il me faut ») : produits, identité de l'entreprise, livraison. Sans elles, le site reste fermé à Google.
2. **DNS chez Hostinger** (section 1) : 2 enregistrements, 5 minutes.
3. **Stripe en mode test** (section 2) : clés dans `.env.local`, jamais dans le chat.
4. **Préparer le VPS** (section 3) : un dossier, un dépôt git, un fichier `.env.local`. Rien ne touche à Chat IA ni à IA Gratuit.
5. **Premier déploiement** (section 3) : `git -C C:\Users\nicolas\pommeau-filtrant push vps main`, puis nginx + HTTPS.

**Toutes les commandes de ce guide nomment leur dossier** : ton terminal s'ouvre dans `C:\Users\nicolas\chat-ia`, qui a lui aussi une destination `vps`. Un `git push vps main` tapé sans `-C` mettrait Chat IA en production à la place de la boutique. Dans PowerShell, tape `npm.cmd` et `npx.cmd` (les scripts `npm`/`npx` y sont bloqués).
6. **Search Console** (section 4) : vérifier le domaine par DNS dès maintenant ; envoyer le sitemap le jour de l'ouverture.
7. **Avant d'ouvrir les ventes** (section 5) : relecture juridique, médiateur, Stripe en mode réel, puis `INDEXABLE = true`.

---

## Pourquoi du code et pas WordPress

Je te conseille de rester en code (Next.js), comme Chat IA :

- tu déploies déjà des sites Next.js sur ce VPS avec `git push` : pas de PHP, de MySQL ni de plugins à installer et à mettre à jour ;
- les pages sont générées à l'avance : très rapides, ce qui compte pour le référencement ;
- le paiement passe par Stripe Checkout : les données de carte ne touchent jamais ton serveur ;
- la surface d'attaque est minime (pas d'admin WordPress exposé, pas de plugins tiers).

WooCommerce deviendrait intéressant si quelqu'un d'autre que toi devait gérer des centaines de produits, les stocks et les factures depuis une interface. Pour tester la demande avec un petit catalogue, le code est plus simple et plus sûr. Ajouter un produit = une entrée dans `src/content/products.ts` (je peux le faire pour toi à partir de la liste du fournisseur).

---

## Ce qu'il me faut de ta part

**Les produits.** Le catalogue est vide : envoie-moi les références du fournisseur. Pour chaque produit, rien ne sera inventé, il me faut :

- la fiche ou le lien du fournisseur : dimensions, raccord, matériaux de la cartouche, durée annoncée des recharges, contenu du carton, notice, garantie ;
- le prix de vente TTC et, si le produit existe en plusieurs tailles ou couleurs, chaque variante ;
- la marque (ou « sans marque ») et, si tu les as, les codes EAN ;
- les photos, avec l'accord du fournisseur pour les utiliser ;
- stock chez toi ou expédition par le fournisseur, le délai réel et le transporteur.

Les marges ne vont jamais dans le code du site : elles restent chez toi.

**L'identité du vendeur** (obligatoire pour les mentions légales et les CGV) :

- raison sociale (ou nom + « EI » si tu es entrepreneur individuel), forme juridique et capital ;
- SIREN et registre (RCS ou RNE) ;
- numéro de TVA intracommunautaire, ou franchise en base de TVA (« TVA non applicable, art. 293 B du CGI ») ;
- adresse du siège, e-mail de contact, téléphone ;
- directeur de la publication ;
- l'hébergeur : la société qui te loue le VPS (nom, adresse, téléphone : ils sont dans ton contrat ou ses mentions légales).

**La livraison et les retours** : pays livrés, transporteurs, prix et délais de chaque option, délai de préparation, et qui paie le retour en cas de rétractation (toi ou le client).

**Le médiateur de la consommation** : tout vendeur à des particuliers doit adhérer à un médiateur avant de vendre. Choisis-en un dans la liste officielle des médiateurs référencés (site de la Commission d'évaluation et de contrôle de la médiation de la consommation, sur economie.gouv.fr) et donne-moi son nom et son site.

**La durée de conservation des journaux nginx** sur le VPS, pour la politique de confidentialité : lance `cat /etc/logrotate.d/nginx` et donne-moi les lignes `daily`/`weekly` et `rotate` (par exemple `daily` + `rotate 14` = 14 jours).

**Le ton du site** : j'ai écrit en « vous », l'usage pour une boutique qui vend aussi aux pros. Dis-moi si tu préfères « tu ».

---

## 1. DNS chez Hostinger

hPanel → **Domaines** → pommeau-filtrant.fr → **DNS / Serveurs de noms** → **Gérer les enregistrements DNS**.

1. Supprime les enregistrements de parking créés par Hostinger pour `@` et `www` (un `A` et/ou un `CNAME`), ainsi qu'un éventuel `AAAA` sur `@` ou `www` : un `AAAA` qui pointe ailleurs fait échouer le certificat HTTPS.
2. Ajoute :

| Type | Nom | Valeur | TTL |
|---|---|---|---|
| A | `@` | `31.97.152.160` | par défaut |
| CNAME | `www` | `pommeau-filtrant.fr` | par défaut |

3. Ne touche pas aux enregistrements `MX` et `TXT` si tu utilises (ou veux utiliser) une adresse e-mail sur ce domaine.
4. Vérifie la propagation (quelques minutes à quelques heures) :

```bash
nslookup pommeau-filtrant.fr
```

La réponse doit contenir `31.97.152.160`.

**Attention** : dès que le DNS pointe vers le VPS, et tant que le site nginx de pommeau-filtrant.fr n'est pas installé (section 3), nginx répond à ce domaine avec son site par défaut, c'est-à-dire l'un des autres sites du VPS. Personne ne connaît encore le domaine, donc c'est sans gravité pendant quelques heures, mais enchaîne la section 3 dans la foulée plutôt que de laisser traîner plusieurs jours.

**Adresse e-mail de contact** : une adresse du type `contact@pommeau-filtrant.fr` rassure les clients et sert pour Stripe. Hostinger peut la créer (ou faire une redirection vers ta boîte Gmail) ; il ajoute alors lui-même les enregistrements `MX` et `TXT` nécessaires.

---

## 2. Stripe

**Conseil** : crée un compte Stripe dédié à la boutique (dans le tableau de bord Stripe, menu de ton compte en haut à gauche → nouveau compte). Il aura son propre nom sur les relevés bancaires des clients et ses propres virements. Le code ignore de toute façon les paiements qui ne viennent pas de ce site.

### En mode test (maintenant)

1. Dashboard Stripe → mode **Test** → **Développeurs** → **Clés API** → copie la **clé secrète** (`sk_test_…`).
2. Dans `C:\Users\nicolas\pommeau-filtrant\.env.local`, mets `STRIPE_SECRET_KEY=sk_test_…`. Ne la colle jamais dans le chat.
3. Pour recevoir le webhook en local, installe la Stripe CLI puis :

```bash
stripe login
```

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Elle affiche un secret `whsec_…` : mets-le dans `.env.local` en `STRIPE_WEBHOOK_SECRET`, puis lance `npm.cmd --prefix C:\Users\nicolas\pommeau-filtrant run build` et `npm.cmd --prefix C:\Users\nicolas\pommeau-filtrant start` (le panier lit la clé au moment du build).

4. Teste une commande avec la carte de test `4242 4242 4242 4242`, une date future et n'importe quel code. La commande apparaît dans `/admin`.

### Réglages du compte (une fois)

- **Paramètres → Moyens de paiement** : cartes ; Apple Pay, Google Pay ou d'autres si tu veux.
- **Paramètres → Informations publiques** : nom de la boutique, e-mail de support, site `https://pommeau-filtrant.fr`, CGV `https://pommeau-filtrant.fr/cgv`.
- **Paramètres → E-mails clients** : active les reçus pour les paiements réussis.
- **Notifications (ton profil)** : active l'alerte « paiement réussi » pour être prévenu de chaque commande.

### En production

1. **Développeurs → Webhooks → Ajouter un endpoint** : `https://pommeau-filtrant.fr/api/stripe/webhook`, avec ces trois événements :
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
2. Copie le **secret de signature** (`whsec_…`) de cet endpoint dans le `.env.local` du VPS (section 3).
3. Le jour de l'ouverture, active ton compte Stripe (vérification d'identité), refais l'étape 1 en mode **réel** (l'endpoint du mode réel a son propre secret), remplace les deux valeurs `sk_test_`/`whsec_` par celles du mode réel sur le VPS, puis redéploie (`git -C C:\Users\nicolas\pommeau-filtrant push vps main`) pour que le panier en tienne compte.

---

## 3. Le VPS

Tout est séparé de Chat IA (port 3030), d'IA Gratuit (port 3020), d'imprimante-etiquettes.fr (port 3040), de parcourschat.fr (port 3050) et de litiere-electrique.fr (port 3060) : dossier `~/pommeau-filtrant`, dépôt `~/repos/pommeau-filtrant.git`, données `~/pommeau-filtrant-data`, app pm2 `pommeau-filtrant` sur le port 3080, qui n'écoute que sur 127.0.0.1 (invisible depuis Internet, seul nginx y accède). Je ne lance aucune commande sur le serveur : c'est toi qui les tapes.

Utilisateur SSH : `nicolas`, le même que pour Chat IA.

### Une seule fois : préparer le serveur

1. Connecte-toi :

```bash
ssh nicolas@31.97.152.160
```

2. Vérifie que Node est en version 22 ou plus et que le port 3080 est libre :

```bash
source ~/.nvm/nvm.sh && node -v
```

```bash
ss -ltn | grep ':3080' || echo "port 3080 libre"
```

Si le port est pris, dis-le-moi : je change le port dans `ecosystem.config.cjs` et `deploy/nginx.conf`.

3. Crée le dépôt, le dossier de l'app et celui des données :

```bash
git init --bare ~/repos/pommeau-filtrant.git && git -C ~/repos/pommeau-filtrant.git symbolic-ref HEAD refs/heads/main
```

```bash
mkdir -p ~/pommeau-filtrant && mkdir -m 700 -p ~/pommeau-filtrant-data
```

4. Crée le fichier des secrets du serveur :

```bash
nano ~/pommeau-filtrant/.env.local
```

avec ces trois lignes (sans les lignes « local only » de `.env.example`) :

```
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
ADMIN_PASSWORD=…
```

Pour le mot de passe du tableau de bord, génère-en un long :

```bash
openssl rand -base64 18
```

Puis protège le fichier :

```bash
chmod 600 ~/pommeau-filtrant/.env.local
```

5. Quitte le serveur (`exit`). Depuis ton PC, installe le hook de déploiement :

```bash
scp C:\Users\nicolas\pommeau-filtrant\deploy\post-receive nicolas@31.97.152.160:repos/pommeau-filtrant.git/hooks/post-receive
```

```bash
ssh nicolas@31.97.152.160 "chmod +x ~/repos/pommeau-filtrant.git/hooks/post-receive"
```

6. Ajoute le serveur comme destination git (le code est aussi sur GitHub : `origin` = github.com/codecirclepro-sketch/pommeau-filtrant) :

```bash
git -C C:\Users\nicolas\pommeau-filtrant remote add vps nicolas@31.97.152.160:repos/pommeau-filtrant.git
```

### Déployer

```bash
git -C C:\Users\nicolas\pommeau-filtrant push vps main
```

La sortie doit contenir `To 31.97.152.160:repos/pommeau-filtrant.git`. Si elle montre `chat-ia.git`, ce n'est pas le bon dépôt : arrête-toi et dis-le-moi.

Le serveur récupère le code, installe, construit et (re)démarre uniquement l'app `pommeau-filtrant`. Après le tout premier déploiement, sur le serveur, enregistre la liste pm2 pour qu'elle redémarre après un reboot :

```bash
source ~/.nvm/nvm.sh && pm2 save
```

### Les e-mails (une fois)

Le site envoie ses e-mails depuis la boîte `contact@pommeau-filtrant.fr` (Hostinger). Sur le serveur, ajoute son mot de passe au `.env.local` de l'app : tu le tapes toi-même, il ne passe jamais par un chat.

```bash
nano ~/pommeau-filtrant/.env.local
```

Ajoute ces deux lignes à la fin (le mot de passe est celui que tu as choisi en créant la boîte dans hPanel), enregistre avec `Ctrl+O`, `Entrée`, puis quitte avec `Ctrl+X` :

```
SMTP_USER=contact@pommeau-filtrant.fr
SMTP_PASSWORD=le-mot-de-passe-de-la-boite
```

Redémarre l'app pour qu'elle les lise :

```bash
source ~/.nvm/nvm.sh && pm2 restart pommeau-filtrant
```

Vérification : sur [/retractation](https://pommeau-filtrant.fr/retractation), déclare une rétractation de test avec ton adresse personnelle (commande « TEST ») ; tu dois recevoir l'accusé de réception, et la boîte `contact@` l'alerte. Le tableau de bord affiche alors « E-mails » en vert.

### nginx et HTTPS (une fois, quand le DNS répond)

Sur le serveur :

```bash
sudo bash ~/pommeau-filtrant/deploy/setup-nginx.sh nginx.conf pommeau-filtrant.fr www.pommeau-filtrant.fr
```

Le script vérifie la configuration nginx actuelle, ajoute seulement le site pommeau-filtrant.fr, le retire tout seul si nginx le refuse (rien ne change alors pour les autres sites), recharge nginx sans coupure puis demande le certificat HTTPS à Let's Encrypt avec redirection http → https. Il refuse de s'exécuter si un site du même nom existe déjà.

Vérifie ensuite : `https://pommeau-filtrant.fr` s'affiche, `https://www.pommeau-filtrant.fr` redirige vers lui.

---

## 4. Search Console

**Maintenant** (le site peut encore être fermé à Google) :

1. [search.google.com/search-console](https://search.google.com/search-console) → **Ajouter une propriété** → type **Domaine** → `pommeau-filtrant.fr`.
2. Google donne un enregistrement `TXT` (`google-site-verification=…`) : ajoute-le chez Hostinger (type TXT, nom `@`), puis clique sur **Vérifier**.

**Le jour de l'ouverture** (après le déploiement avec `INDEXABLE = true`) :

1. **Sitemaps** → envoie `https://pommeau-filtrant.fr/sitemap.xml`.
2. **Inspection de l'URL** → demande l'indexation de l'accueil et des rayons.
3. Optionnel : [Bing Webmaster Tools](https://www.bing.com/webmasters) → importer depuis Search Console.
4. **Le jour où les paiements ouvrent** (section 5) : Google Merchant Center, pour apparaître gratuitement dans l'onglet Shopping. Google refuse une boutique où l'on ne peut pas payer : pas avant.
   1. [merchants.google.com](https://merchants.google.com) → crée le compte avec le même compte Google que Search Console, pays France, site `https://pommeau-filtrant.fr` (il se vérifie tout seul grâce à Search Console).
   2. **Livraison et retours** : saisis les mêmes tarifs, délais et conditions de retour que dans `src/content/shop.ts`.
   3. **Produits → Ajouter des produits → Fichier** → « Récupération planifiée » avec l'adresse `https://pommeau-filtrant.fr/google-merchant.xml`, une fois par jour. Le flux est construit à partir du catalogue : un produit publié et en stock y apparaît tout seul.
   4. Si le fournisseur te donne les codes EAN ou la marque, ajoute-les aux produits (`gtin`, `brand`) : Google les met mieux en avant.

Ce que Search Console te dira (impressions, clics, requêtes tapées) est le meilleur indicateur de la demande. Le tableau de bord du site, lui, montre ce que font les visiteurs une fois arrivés.

---

## 5. Les deux ouvertures

### Ouvrir le site à Google (mesurer la demande)

- [ ] Ton identité de vendeur est dans `src/content/shop.ts` (raison sociale, forme, SIREN, TVA, adresse, e-mail, téléphone, directeur de la publication, hébergeur) : les mentions légales sont obligatoires dès que le site est public.
- [ ] Au moins un produit est publié (8 le sont).
- [ ] Je passe `INDEXABLE` à `true` dans `src/lib/site.ts`, tu déploies, puis tu envoies le sitemap (section 4).

À ce moment-là, les brouillons disparaissent du site et, tant que Stripe est en mode test, le panier affiche « paiement pas encore ouvert » : les visiteurs peuvent ajouter au panier (on mesure l'intérêt), personne ne tombe sur un paiement de test.

### Ouvrir les paiements (premières ventes)

- [ ] Les prix couvrent le coût réel livré (annonce + port fournisseur) et les frais Stripe.
- [ ] Livraison et retours sont remplis dans `src/content/shop.ts` (transporteurs, délais réels, prix, qui paie le retour).
- [ ] Tu as adhéré à un médiateur de la consommation.
- [ ] Les CGV ont été relues par un juriste, en particulier l'encadré sur la garantie légale de conformité ; je retire alors la note jaune en tête des CGV.
- [ ] Les e-mails partent : le mot de passe de la boîte `contact@pommeau-filtrant.fr` est dans le `.env.local` du VPS (section 3, « Les e-mails »), et le tableau de bord affiche « E-mails » en vert. Le site envoie alors tout seul la confirmation de commande au client (avec les CGV), une alerte à chaque commande, et l'accusé de réception des rétractations faites sur [/retractation](https://pommeau-filtrant.fr/retractation).
- [ ] Les obligations d'importateur sont vérifiées pour ces produits de salle de bain venus de Chine : notice et consignes en français, fabricant ou responsable dans l'UE identifié (règlement européen GPSR), et, pour des matériaux au contact de l'eau du robinet, ce que la réglementation française demande (attestation de conformité sanitaire, à vérifier avec un professionnel).
- [ ] Stripe est en mode réel, avec le webhook du mode réel, puis tu redéploies. Tant que les champs de livraison et de retour de `src/content/shop.ts` sont vides, la clé réelle seule n'ouvre pas le paiement : le tableau de bord l'indique. Le médiateur, obligatoire, reste à ajouter dès ton adhésion.

---

## Le tableau de bord

`https://pommeau-filtrant.fr/admin` : la page demande le mot de passe `ADMIN_PASSWORD` du `.env.local` du serveur, puis te garde connecté 30 jours sur ce navigateur (bouton « Se déconnecter » en haut). Sans ce mot de passe dans `.env.local`, la page répond 404.

Il montre, sur 7, 30 ou 90 jours : les visites (arrivées sur le site), les pages vues, les ajouts au panier, les paiements commencés, les commandes payées et le chiffre d'affaires ; les visites par jour, les pages les plus vues, la provenance (Google, accès direct, autres sites), la liste des commandes avec un lien vers Stripe, et l'état de la mise en ligne (Stripe, webhook, champs à compléter, indexation).

Les visites sont comptées sans cookie, sans adresse IP enregistrée, robots exclus : ce sont des ordres de grandeur. Clique sur « Ne plus les compter » en bas du tableau de bord, sur chacun de tes navigateurs, pour que tes propres visites ne faussent pas les chiffres. Le nom, l'e-mail et l'adresse des clients restent dans Stripe.

## Sécurité, en résumé

- L'app n'écoute que sur 127.0.0.1:3080 : seul nginx, sur le même serveur, peut l'atteindre. Aucun port à ouvrir dans le pare-feu.
- Le script nginx n'ajoute que son propre fichier, teste la configuration avant de recharger et annule tout si nginx refuse.
- Les secrets sont dans `.env.local` (droits 600), jamais dans git ; les données dans un dossier à part (droits 700).
- Le paiement se fait chez Stripe ; le webhook n'accepte que les requêtes signées par Stripe et ignore les paiements d'autres sites.
- Le tableau de bord est protégé par mot de passe (vérifié deux fois, comparaison à temps constant) et n'est accessible qu'en HTTPS une fois le certificat installé.
- En-têtes de sécurité (CSP stricte, pas d'iframe, HSTS), aucun script ni police chargés depuis un autre site, limites de requêtes sur le paiement et le compteur de visites.
