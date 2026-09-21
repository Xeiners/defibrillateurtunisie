# Service d'envoi des demandes de devis

Reçoit le formulaire de `/devis`, compose le mail et l'envoie par le SMTP de
Gmail.

## Pourquoi un service, et pas le front

Le SMTP est un protocole **TCP** : un navigateur ne peut pas ouvrir de socket
TCP, il ne sait donc pas parler SMTP. Et même si c'était possible, des
identifiants Gmail placés dans le front seraient lisibles par quiconque ouvre le
code source de la page — n'importe qui pourrait envoyer des messages depuis
votre adresse, et Google finirait par bloquer le compte.

Vos accès vivent donc ici, dans `.env`, et ne quittent jamais le VPS.

## Mise en route

### 1. Le mot de passe d'application Google

Gmail refuse le mot de passe du compte pour le SMTP. Il faut un **mot de passe
d'application** :

1. activez la validation en deux étapes sur le compte Google ;
2. rendez-vous sur <https://myaccount.google.com/apppasswords> ;
3. créez un mot de passe pour « Autre » → `Defibrillateur.TN` ;
4. recopiez les seize caractères obtenus.

### 2. Installation

```sh
cd server
cp .env.example .env
nano .env            # SMTP_USER, SMTP_PASSWORD, MAIL_TO
npm install
npm start
```

Le service écoute sur le port `8787` et affiche l'adresse de destination au
démarrage. Vérification : `curl http://127.0.0.1:8787/api/devis/sante`.

### 3. Le laisser tourner

Avec pm2 :

```sh
npm install -g pm2
pm2 start index.mjs --name devis
pm2 save
pm2 startup          # suivre la commande affichée
```

Ou en service systemd, `/etc/systemd/system/devis.service` :

```ini
[Unit]
Description=Envoi des demandes de devis Defibrillateur.TN
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/defibrillateurtunisie/server
ExecStart=/usr/bin/node index.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```sh
systemctl enable --now devis
```

### 4. Relayer `/api/devis` depuis le serveur web

Le front appelle `/api/devis` sur son propre domaine : il n'y a donc aucune
origine croisée à régler. Il faut que nginx (ou Apache) passe cette adresse au
service.

**nginx** — dans le bloc `server` du site :

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Le site est une application à deux pages : toute adresse inconnue
# (/devis, par exemple) doit renvoyer index.html, sinon c'est un 404.
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache** — le `public/.htaccess` du site s'occupe déjà de la réécriture
`/devis`. Pour le relais, activez `proxy` et `proxy_http` puis ajoutez au
VirtualHost :

```apache
ProxyPass        /api/ http://127.0.0.1:8787/api/
ProxyPassReverse /api/ http://127.0.0.1:8787/api/
```

## En développement

Le front tourne sur `localhost:5173`, le service sur `localhost:8787` : ce sont
deux origines différentes. Deux façons de faire :

- **relayer depuis Vite** (rien à changer dans le code) — ajoutez à
  `vite.config.ts` :

  ```ts
  server: { proxy: { '/api': 'http://localhost:8787' } }
  ```

- **ou** renseigner `ALLOWED_ORIGIN=http://localhost:5173` dans `.env`, et
  `VITE_QUOTE_ENDPOINT=http://localhost:8787/api/devis` dans un `.env.local` à
  la racine du site.

## Ce que le service fait, et ne fait pas

- Il **compose le mail lui-même** (`email.mjs`). Le navigateur n'envoie que des
  données : sans cela, n'importe qui pourrait poster son propre HTML à cette
  adresse et le faire partir depuis votre domaine.
- Il **échappe tout** ce qui vient du visiteur.
- Il **limite à 5 demandes par quart d'heure et par IP**. Une adresse qui envoie
  des mails, ouverte sur l'internet, finit toujours par être trouvée.
- Il **écarte les robots** par un champ piège, invisible dans le formulaire.
- Il place le visiteur en `Reply-To` : répondre au mail lui répond directement.
- Il **envoie un récapitulatif au visiteur** (`buildConfirmationEmail`), après
  avoir répondu au navigateur : son échec n'annule pas la demande, déjà arrivée
  chez l'équipe. S'il y répond, sa réponse arrive sur `MAIL_TO`.
- Ce récapitulatif **ne reprend pas le champ « précisions »**. Il part vers une
  adresse saisie dans le formulaire : recopier le texte libre permettrait
  d'envoyer, depuis votre domaine, le message de son choix à n'importe qui. Le
  message complet n'arrive que chez l'équipe.

`npm run apercu` écrit les deux mails d'exemple dans `apercu.html` (équipe) et
`apercu-client.html` (visiteur).
