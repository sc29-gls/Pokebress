comando da aggiungere a streamelements da chat

!command add !pokebress $(urlfetch https://pokebress.onrender.com/pokebress?id=$(queryescape ${0:})) bre90sHype bre90sHype
	

per lanciare in locale
-----------------------
da terminale scrivere:
1) npm init -y
2) npm install express cors
3) node PokeBress.V2.js
------------------------
da browser scrivere
1) http://localhost:3000/pokebress?id=!pokebress%2025
dove "!pokebress%2025" è la codifica del !pokebress 25
