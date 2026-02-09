comando da aggiungere a streamelements da chat 
	!command add !pokebress $(urlfetch https://pokebress.onrender.com/pokebress?id=$(queryescape ${0:})) bre90sHype bre90sHype
	

per lanciare in locale
da terminale scrivere:
	npm init -y
	npm install express cors
	node serverBre90ss.js
da browser scrivere
  http://localhost:3000/pokebress?id=!pokebress%2025
