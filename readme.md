# Git Kollaboration

## Basics

##### (1) Jeden Morgen ein mal pullen, bevor man weiter arbeitet, um eventuelle Änderungen von der main branch zu übernehmen

> git pull origin dev

##### (2) Für jedes Feature eine neue feature branch anlegen und zu ihr wechseln mit

> git checkout -b feat/UserSchema

##### (3) Hier wie üblich mit staging und commits arbeiten

> git add .
> git commit -m "commit message im Imperativ z.B: add UserSchema"

##### (4) Pushen mit Origin - sonst müsste upstream jedes Mal gesetzt werden für jedes Feature ==> nur mit fertigem funktionierendem Code - da es eines Pull Requests bedarf

> git push origin feat/UserSchema

## Feature Merge

##### Pull Request wird händisch per Github erstellt, hier darauf achten das die dev branch ausgewählt ist, deafult ist main

Code überprüfen
--> branch löschen

##### lokal --> zur dev branch wechseln

> git checkout dev
> git pull origin dev
> git branch -d feat/UserSchema

## Dann der beginnt der Kreislauf von vorne

![Branch-Struktur](/readmebilder/branchStruktur.png)

Startschuss 05.12.24 13.17 Dev branch wird geöffnet