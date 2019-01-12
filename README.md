## Qien Assignment - 4 op een rij

Ontvangen 11 januari 2019, docent Paul Vermeer.



NodeJS-Express Server, 

- ontvangt request
  - action (int)
  - value (int)
  - player (int)
- antwoordt met response
  - action  (int)
  - player  (int)
  - status (boolean)
  - message (string)
  - state (object)
  - (error_message (string))
  - (error_id (int))



Acties

- Nieuw spel
- Einde spel
- Zet
  - speler
  - kolom (A-G = 0-6)



Game

- finished (boolean)
- cancelled (boolean)
- won (boolean)
- last_player (int) (=winner when won==true)
- nr_of_plays (int) (? same as plays.length)
- plays
  - player
  - value
  - state_after_play





Initialize project

```
npm init
npm install express
npm install mongoose
git init
git add .
git remote add origin git@github.com:ZjanPreijde/Qien-Connect4.git
git push -u origin master
```

